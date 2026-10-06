(function () {
  "use strict";

  const wedding = window.WEDDING;
  if (!wedding) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    bindText();
    setDocumentMeta();
    setGuestGreeting();
    setDateMedallion();
    renderEvents();
    renderStory();
    renderGallery();
    renderMealOptions();
    renderRsvpEvents();
    setupMap();
    setupShare();
    setupCountdown();
    setupEnvelope();
    setupRsvp();
    setupLightbox();
    setupDock();
    setupPetals();
    prefillName();
  }

  function bindText() {
    document.querySelectorAll("[data-text]").forEach((el) => {
      const value = readPath(wedding, el.dataset.text);
      if (value != null) el.textContent = String(value);
    });
  }

  function readPath(obj, path) {
    return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
  }

  function setDocumentMeta() {
    const { bride, groom } = wedding.couple;
    const title = `${bride.firstName} & ${groom.firstName} — Wedding Invitation`;
    document.title = title;
    const desc = `You are invited to the wedding of ${groom.fullName} and ${bride.fullName}.`;
    setMeta('meta[name="description"]', desc);
    setMeta('meta[property="og:title"]', `${bride.firstName} & ${groom.firstName} — You're invited`);
    setMeta('meta[property="og:description"]', `${wedding.displayDate}`);
    document.getElementById("groom-mono").textContent = groom.firstName.charAt(0);
    document.getElementById("bride-mono").textContent = bride.firstName.charAt(0);
    setPortrait("groom-photo", "groom-mono", groom.photo, groom.fullName);
    setPortrait("bride-photo", "bride-mono", bride.photo, bride.fullName);
  }

  function setPortrait(imgId, monoId, src, alt) {
    if (!src) return;
    const img = document.getElementById(imgId);
    const mono = document.getElementById(monoId);
    img.src = src;
    img.alt = alt;
    img.hidden = false;
    if (mono) mono.hidden = true;
    img.addEventListener("error", () => {
      img.hidden = true;
      if (mono) mono.hidden = false;
    });
  }

  function setMeta(selector, content) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute("content", content);
  }

  function guestFromQuery() {
    const raw = new URLSearchParams(window.location.search).get("to");
    if (!raw) return "";
    return raw.replace(/\s+/g, " ").trim().slice(0, 80);
  }

  function setGuestGreeting() {
    const guest = guestFromQuery();
    const line = document.getElementById("gate-guest");
    line.textContent = guest || "Our Cherished Guest";
  }

  function prefillName() {
    const guest = guestFromQuery();
    const input = document.getElementById("rsvp-name");
    if (guest && input) input.value = guest;
  }

  function setDateMedallion() {
    const date = new Date(wedding.datetime);
    if (Number.isNaN(date.getTime())) return;
    const dotted = [
      String(date.getDate()).padStart(2, "0"),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getFullYear()),
    ].join(" · ");
    const cover = document.getElementById("cover-date");
    const hero = document.getElementById("hero-date-line");
    if (cover) cover.textContent = dotted;
    if (hero) hero.textContent = dotted;
  }

  function renderEvents() {
    const root = document.getElementById("event-list");
    root.replaceChildren();
    wedding.events.forEach((event) => {
      const article = document.createElement("article");
      article.className = "event-card";

      const title = document.createElement("h3");
      title.textContent = event.title;

      const time = document.createElement("p");
      time.className = "event-card__time";
      time.textContent = event.time;

      const venue = document.createElement("p");
      venue.className = "event-card__venue";
      venue.textContent = event.venue;

      const note = document.createElement("p");
      note.className = "event-card__note";
      note.textContent = event.note || "";

      const actions = document.createElement("div");
      actions.className = "event-card__actions";

      const cal = document.createElement("button");
      cal.type = "button";
      cal.className = "btn btn--ghost";
      cal.textContent = "Add to calendar";
      cal.addEventListener("click", () => downloadIcs(event));

      actions.append(cal);
      article.append(title, time, venue, note, actions);
      root.append(article);
    });
  }

  function icsStamp(iso) {
    return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }

  function downloadIcs(event) {
    const { bride, groom } = wedding.couple;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedding Invitation//EN",
      "BEGIN:VEVENT",
      `DTSTAMP:${icsStamp(new Date().toISOString())}`,
      `DTSTART:${icsStamp(event.isoStart)}`,
      `DTEND:${icsStamp(event.isoEnd)}`,
      `SUMMARY:${bride.firstName} & ${groom.firstName} — ${event.title}`,
      `LOCATION:${event.venue}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function renderStory() {
    const root = document.getElementById("timeline");
    root.replaceChildren();
    wedding.story.forEach((item) => {
      const el = document.createElement("article");
      el.className = "milestone";
      const year = document.createElement("p");
      year.className = "milestone__year";
      year.textContent = item.year;
      const title = document.createElement("h3");
      title.textContent = item.title;
      const body = document.createElement("p");
      body.textContent = item.body;
      el.append(year, title, body);
      root.append(el);
    });
  }

  function renderGallery() {
    const root = document.getElementById("gallery-grid");
    root.replaceChildren();
    wedding.gallery.forEach((photo, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery-item";
      btn.setAttribute("aria-label", photo.alt || `Photograph ${index + 1}`);

      const img = document.createElement("img");
      img.alt = photo.alt || "";
      img.loading = "lazy";
      img.src = photo.src;
      const showFallback = () => {
        img.remove();
        const fallback = document.createElement("span");
        fallback.className = "gallery-fallback";
        fallback.textContent = wedding.monogram;
        btn.append(fallback);
        btn.disabled = true;
        btn.style.cursor = "default";
      };
      img.addEventListener("error", showFallback);
      const enableZoom = () => {
        btn.addEventListener("click", () => openLightbox(photo.src, photo.alt));
      };
      if (img.complete && img.naturalWidth > 0) enableZoom();
      else img.addEventListener("load", enableZoom);

      btn.append(img);
      root.append(btn);
    });
  }

  function openLightbox(src, alt) {
    const box = document.getElementById("lightbox");
    const image = document.getElementById("lightbox-image");
    image.src = src;
    image.alt = alt || "";
    box.hidden = false;
    requestAnimationFrame(() => box.classList.add("is-open"));
    document.getElementById("lightbox-close").focus();
  }

  function setupLightbox() {
    const box = document.getElementById("lightbox");
    const close = () => {
      box.classList.remove("is-open");
      window.setTimeout(() => {
        box.hidden = true;
        document.getElementById("lightbox-image").src = "";
      }, 220);
    };
    document.getElementById("lightbox-close").addEventListener("click", close);
    box.addEventListener("click", (e) => {
      if (e.target === box) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && box.classList.contains("is-open")) close();
    });
  }

  function renderMealOptions() {
    const select = document.getElementById("rsvp-meal");
    select.replaceChildren();
    wedding.meals.forEach((meal) => {
      const opt = document.createElement("option");
      opt.value = meal;
      opt.textContent = meal;
      select.append(opt);
    });
  }

  function renderRsvpEvents() {
    const root = document.getElementById("rsvp-events");
    root.replaceChildren();
    wedding.events.forEach((event) => {
      const label = document.createElement("label");
      label.className = "check";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "event";
      input.value = event.title;
      input.checked = true;
      const span = document.createElement("span");
      span.textContent = event.title;
      label.append(input, span);
      root.append(label);
    });
  }

  function setupMap() {
    document.getElementById("map-frame").src = wedding.map.embed;
    const dir = document.getElementById("directions");
    dir.href = wedding.map.directions;
  }

  function setupShare() {
    const { bride, groom } = wedding.couple;
    const text = `You're invited to ${groom.firstName} & ${bride.firstName}'s wedding — ${wedding.displayDate}`;
    const url = window.location.href;
    document.getElementById("share-whatsapp").href =
      `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
  }

  function setupCountdown() {
    const target = new Date(wedding.datetime).getTime();
    const nodes = {
      days: document.querySelector('[data-count="days"]'),
      hours: document.querySelector('[data-count="hours"]'),
      minutes: document.querySelector('[data-count="minutes"]'),
      seconds: document.querySelector('[data-count="seconds"]'),
    };

    function tick() {
      const diff = Math.max(0, target - Date.now());
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      nodes.days.textContent = String(days).padStart(2, "0");
      nodes.hours.textContent = String(hours).padStart(2, "0");
      nodes.minutes.textContent = String(minutes).padStart(2, "0");
      nodes.seconds.textContent = String(seconds).padStart(2, "0");
    }

    tick();
    window.setInterval(tick, 1000);
  }

  function setupEnvelope() {
    const gate = document.getElementById("gate");
    const card = document.getElementById("cover-card");
    const btn = document.getElementById("open-btn");
    const invitation = document.getElementById("invitation");

    btn.addEventListener("click", () => openInvitation(gate, card, btn, invitation, false));
    if (new URLSearchParams(window.location.search).has("open")) {
      openInvitation(gate, card, btn, invitation, true);
    }
  }

  function openInvitation(gate, card, btn, invitation, instant) {
    btn.disabled = true;
    if (card) card.classList.add("is-open");
    startMusic();
    const delay = instant || reducedMotion ? 80 : 520;
    window.setTimeout(() => {
      gate.classList.add("is-gone");
      invitation.classList.remove("is-locked");
      document.getElementById("dock").classList.add("is-visible");
      document.getElementById("petals").classList.add("is-on");
      gate.setAttribute("aria-hidden", "true");
      if (instant && window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) target.scrollIntoView();
      }
    }, delay);
  }

  function startMusic() {
    if (!wedding.music) return;
    const audio = document.getElementById("bg-music");
    const toggle = document.getElementById("music-toggle");
    audio.src = wedding.music;
    const play = audio.play();
    if (play && typeof play.catch === "function") play.catch(() => {});
    audio.addEventListener("error", () => {
      toggle.hidden = true;
      toggle.classList.remove("is-visible");
    });
    audio.addEventListener("playing", () => {
      toggle.hidden = false;
      toggle.classList.add("is-visible");
    });
    toggle.addEventListener("click", () => {
      audio.muted = !audio.muted;
      toggle.classList.toggle("is-muted", audio.muted);
      toggle.setAttribute("aria-label", audio.muted ? "Unmute music" : "Mute music");
    });
  }

  function setupRsvp() {
    const form = document.getElementById("rsvp-form");
    const error = document.getElementById("rsvp-error");
    const submit = document.getElementById("rsvp-submit");
    const guestsField = document.getElementById("guests-field");

    form.addEventListener("change", () => {
      const attending = form.attending.value;
      guestsField.hidden = attending === "no";
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      error.textContent = "";
      const payload = readRsvp(form);
      const problem = validateRsvp(payload);
      if (problem) {
        error.textContent = problem;
        return;
      }

      submit.classList.add("is-loading");
      submit.disabled = true;
      submit.textContent = "Sending…";

      try {
        await deliverRsvp(payload);
        form.classList.add("is-hidden");
        document.getElementById("rsvp-success").classList.add("is-visible");
      } catch (err) {
        error.textContent = "We could not send that just now. Please try again.";
        submit.disabled = false;
        submit.classList.remove("is-loading");
        submit.textContent = "Send RSVP";
      }
    });
  }

  function readRsvp(form) {
    const events = [...form.querySelectorAll('input[name="event"]:checked')].map((el) => el.value);
    return {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      attending: form.attending.value,
      guests: Number(form.guests.value || 1),
      events,
      meal: form.meal.value,
      note: form.note.value.trim(),
      submittedAt: new Date().toISOString(),
    };
  }

  function validateRsvp(payload) {
    if (payload.name.length < 2) return "Please tell us your name.";
    if (!payload.attending) return "Please let us know if you can attend.";
    if (payload.attending === "yes" && (payload.guests < 1 || payload.guests > 10)) {
      return "Please enter a party size between 1 and 10.";
    }
    if (payload.phone && !/^[0-9+\-\s()]{7,20}$/.test(payload.phone)) {
      return "That mobile number does not look right.";
    }
    return "";
  }

  async function deliverRsvp(payload) {
    const stored = safeReadStore();
    stored.push(payload);
    try {
      localStorage.setItem("wedding-rsvps", JSON.stringify(stored));
    } catch {
      /* storage may be blocked */
    }

    if (wedding.rsvpWebhook) {
      const res = await fetch(wedding.rsvpWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("webhook");
    }

    if (wedding.whatsapp) {
      const message = formatWhatsApp(payload);
      window.open(`https://wa.me/${wedding.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    }
  }

  function safeReadStore() {
    try {
      const raw = localStorage.getItem("wedding-rsvps");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function formatWhatsApp(payload) {
    const { bride, groom } = wedding.couple;
    const events = payload.events.length ? payload.events.join(", ") : "None selected";
    return [
      `RSVP — ${groom.firstName} & ${bride.firstName}`,
      `Name: ${payload.name}`,
      `Attending: ${payload.attending}`,
      `Guests: ${payload.guests}`,
      `Events: ${events}`,
      `Meal: ${payload.meal}`,
      payload.phone ? `Phone: ${payload.phone}` : "",
      payload.note ? `Note: ${payload.note}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  function setupDock() {
    const links = [...document.querySelectorAll("#dock a")];
    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.1 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function setupPetals() {
    const root = document.getElementById("petals");
    if (reducedMotion) return;
    for (let i = 0; i < 8; i += 1) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.left = `${8 + i * 12}%`;
      petal.style.animationDuration = `${9 + (i % 5)}s`;
      petal.style.animationDelay = `${i * 0.8}s`;
      petal.style.opacity = String(0.28 + (i % 3) * 0.1);
      root.append(petal);
    }
  }
})();
