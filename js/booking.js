/* booking.html: polls api/reservation.php until the Stripe webhook has confirmed the booking. */
(function () {
  "use strict";
  var qs = new URLSearchParams(location.search), box = document.getElementById("booking_status"), url = "";
  if (qs.get("hold") && qs.get("session_id")) url = "api/reservation.php?hold=" + encodeURIComponent(qs.get("hold")) + "&session_id=" + encodeURIComponent(qs.get("session_id"));
  else if (qs.get("ref") && qs.get("email")) url = "api/reservation.php?ref=" + encodeURIComponent(qs.get("ref")) + "&email=" + encodeURIComponent(qs.get("email"));

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function day(d) { return new Date(d + "T12:00:00").toLocaleDateString(undefined, { weekday: "short", month: "long", day: "numeric", year: "numeric" }); }
  function show(html) { box.innerHTML = html; }
  var again = '<p><a class="btn btn_primary" href="index.html#rates">Pick dates again</a></p>';

  if (!url) { show('<h2>No booking in this link</h2><p class="muted">Open the link from your confirmation email, or contact us and we will look it up.</p>' + again); return; }

  var tries = 0, MAX = 30;
  function later() { if (++tries < MAX) setTimeout(poll, 2000); else show('<h2>Still confirming</h2><p class="muted">Your payment is taking longer than usual to confirm. You will get a confirmation email as soon as it does. You can also refresh this page in a minute.</p>'); }
  function poll() {
    fetch(url, { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (d) {
      if (!d.ok) { show('<h2>Booking not found</h2><p class="muted">' + esc(d.message || "") + "</p>" + again); return; }
      if (d.status === "confirmed" && d.reservation) {
        var r = d.reservation;
        show("<h2>You're booked</h2>" +
          "<p>Thank you, " + esc(r.guest_name) + ". A confirmation is on its way to " + esc(r.guest_email) + ".</p>" +
          '<ul class="booking_facts">' +
          "<li><span>Reference</span><b>" + esc(r.ref) + "</b></li>" +
          "<li><span>Property</span><b>" + esc(r.property) + "</b></li>" +
          "<li><span>Check-in</span><b>" + esc(day(r.checkin)) + "</b></li>" +
          "<li><span>Check-out</span><b>" + esc(day(r.checkout)) + "</b></li>" +
          "<li><span>Guests</span><b>" + esc(r.guests) + " adults" + (r.children ? ", " + esc(r.children) + " children" : "") + "</b></li>" +
          "<li><span>Total paid</span><b>" + esc(r.total) + " " + esc(r.currency) + "</b></li>" +
          "</ul>" + '<p><a class="btn btn_primary" href="index.html">Back to the condo</a></p>');
        return;
      }
      if (d.status === "expired" || d.status === "cancelled") {
        show('<h2>This hold has ended</h2><p class="muted">No booking was made for these dates. If you were charged, contact us and we will sort it out straight away.</p>' + again);
        return;
      }
      later();
    }).catch(later);
  }
  poll();
})();
