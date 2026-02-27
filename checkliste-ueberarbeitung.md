# Checkliste Überarbeitung — LFA Landing Page
> Für inhaltliche Überarbeitungen. **Fett** = unbedingt behalten. Alles andere kann angepasst werden.

---

## SEKTIONEN — Diese müssen alle erhalten bleiben

- [ ] **Hero** (Einstieg mit Headline, Subline, Badge, Partikel-Hintergrund)
- [ ] **Problem** (Dramatische Darstellung: 3 Statistiken + 3 Problem-Karten + Fazit-Satz)
- [ ] **Bridge** (roter Übergang: "LFA ändert das." — kurzer dramatischer Zwischenblock)
- [ ] **Lösung** (3 Lösungskarten + Vorteile-Block)
- [ ] **Rollen** (Ausbilder-Karte und Azubi-Karte nebeneinander)
- [ ] **Warum LFA** (Bento-Grid mit 2 großen + 4 kleinen Karten + Vergleichstabelle)
- [ ] **Funktionen** (2 Featured-Module + 6 kleine Modul-Karten)
- [ ] **Tätigkeitsnachweis & Arbeitszeugnis** (Timeline links + Dokument-Mockup rechts)
- [ ] **Solar System / Universum** (interaktive Galaxie — nur JS, nicht anfassen)
- [ ] **Demo** (iFrame-Einbettung fiae-learn.com/demo)
- [ ] **HAI** (KI-Assistent: Chat-Demo + 4 Feature-Boxen + Statistiken)
- [ ] **Wie HAI denkt** (5-Schritte-Grafik + 3 Karten: Chat / Quiz / Garantien)
- [ ] **Kosten / ROI** (30.000 EUR + 40% + 60% Kacheln)
- [ ] **Architektur** (3 Trust-Karten + Tech-Marquee)
- [ ] **6 Gründe / Roadmap** (Snake-Timeline mit 6 Punkten + End-Node)
- [ ] **FAQ** (5 Fragen — Anzahl kann variieren, Format beibehalten)
- [ ] **Footer** (3 Spalten + Siegel "Entwickelt in Deutschland")

---

## DESIGN-ELEMENTE — Nicht entfernen oder umbenennen

### Farben & Stil
- [ ] **Akzentfarbe Rot** bleibt `#ff1a1a` / `var(--color-accent)` — keine andere Farbe
- [ ] **Dunkle Sektionen** bleiben dunkel (`#0f0f11`, `#09111f`) — kein Aufhellen
- [ ] **Helle Sektionen** bleiben hell (`var(--color-bg)`) — kein Abdunkeln
- [ ] Section-Übergänge (Gradient-Divider zwischen hell↔dunkel) **nicht löschen**

### Navigation
- [ ] Logo links, Nav-Links in **Pill-Container** rechts — Struktur beibehalten
- [ ] Alle 11 Nav-Links müssen zu ihren Sektionen zeigen (`data-nav-section` Attribut nicht entfernen)
- [ ] Mobiles Hamburger-Menü bleibt

### Hero
- [ ] **Partikel-Animation** bleibt (Canvas `#heroParticles` nicht entfernen)
- [ ] **Tipp-Animation** bleibt (wechselt zwischen Texten — `id="typingTarget"` nicht entfernen)
- [ ] Badge-Text darf geändert werden — aktuell: *"Gerade gelauncht · Version 1.0"*

### Problem-Sektion
- [ ] **3 Statistiken** müssen bleiben (Zahlen dürfen aktualisiert werden, Quellen-Badges auch)
- [ ] **3 Problem-Karten** — Format beibehalten (Icon-Badge oben + Titel + Text + roter Fazit-Satz unten)
- [ ] Dramatischer Abschluss-Satz in **Rot** bleibt (der große rote Text ganz unten)

### Lösung-Karten
- [ ] **Flex-Column Layout** der 3 Karten beibehalten (Linie + Checkmark immer unten ausgerichtet)
- [ ] Rote Trennlinie + grüner Checkmark-Text pro Karte **nicht entfernen**

### Tätigkeitsnachweis-Modul
- [ ] **5-Schritte-Timeline** links bleibt (Nummern, rote Linie, Schritt-Texte)
- [ ] **Dokument-Mockup** rechts bleibt (goldene Border, WAMOCON-Header, Bewertungsfelder)
- [ ] **Oranger Connector-Pfeil** in der Mitte bleibt

### Solar System
- [ ] ⚠️ **Diesen Bereich nicht anfassen** — komplex, nur JS/Canvas
- [ ] Text über der Galaxie darf geändert werden (Badge, Headline, Subline)

### HAI-Sektion
- [ ] **Chat-Blasen-Demo** bleibt (linke Seite, blau/grau)
- [ ] **4 Feature-Boxen** bleiben (100% / 3 Stufen / Quiz / Immer mit Quelle)
- [ ] **Quiz-Progressionsbalken** bleiben animiert (LEICHT/MITTEL/SCHWER)
- [ ] **5-Schritte-RAG-Pipeline** ("So entsteht jede HAI-Antwort") bleibt — Karten-Animation läuft beim Scrollen

### ROI-Sektion
- [ ] **Counter-Animationen** nicht entfernen (`data-target` Attribute auf den Zahlen-Divs beibehalten)
- [ ] `whitespace-nowrap` auf "EUR"-Suffix beibehalten (sonst bricht Layout)

### Roadmap / 6 Gründe
- [ ] **Snake-SVG-Pfad** bleibt (wird per JS gezeichnet — `id="rmSvg"` / `id="rmLine"` nicht löschen)
- [ ] Alle 6 `.rm__row` Blöcke bleiben (alternierend links/rechts)
- [ ] **End-Node** (roter Checkmark-Kreis am Ende) bleibt

### FAQ
- [ ] **Accordion-Funktion** bleibt (aufklappbar — `class="faq-item"` Struktur beibehalten)

### Footer
- [ ] **"Entwickelt in Deutschland" Siegel** bleibt (SVG mit Lorbeerkranz)
- [ ] 3-Spalten-Layout bleibt
- [ ] Alle rechtlichen Links bleiben (Datenschutz / Impressum / AGB / Cookies)

---

## WAS FREI ANGEPASST WERDEN DARF

- Alle **Texte, Headlines, Sublines, Beschreibungen** in den Karten
- **Statistiken und Zahlen** (Quellen-Badges aktualisieren)
- **Tag-Labels** (z.B. "Closed-Context", "Anti-Halluzination" etc.)
- **FAQ-Fragen und Antworten** (Anzahl kann von 5 abweichen, aber Format beibehalten)
- **Roadmap-Titel und Beschreibungen** der 6 Punkte
- **Badge-Texte** über den Sektionen (kleine rote/blaue Labels)

---

## TECHNISCHE REGELN — Unbedingt beachten

| Was | Warum |
|-----|-------|
| Keine `id`-Attribute ändern | Nav-Links, JS-Animationen und Scroll-Tracking hängen dran |
| Keine `class`-Attribute löschen | CSS-Animationen (reveal, rm__card, quiz-bar etc.) hören darauf |
| `data-target` auf Counter-Divs beibehalten | Counter-Animation liest den Zielwert daraus |
| `data-rm-progress` auf Roadmap-Zeilen beibehalten | Snake-Path-Sync liest die Scroll-Position daraus |
| `data-nav-section` auf Nav-Links beibehalten | Aktive Sektion wird darüber getrackt |
| `data-quiz-target` auf Progressbalken beibehalten | Balken-Animation liest Zielbreite daraus |
| Keine `<script>` Tags löschen | Alle Interaktionen laufen über script.js |
| style.css `<link>` im `<head>` nicht entfernen | Scrollbar + weitere Styles hängen daran |

---

## KURZFASSUNG FÜR DEN KOLLEGEN

> Texte ändern = ✅ immer okay
> Sektionen löschen = ❌ nicht ohne Absprache
> `id`, `class`, `data-*` Attribute = ❌ nicht anfassen
> Design-Farben / Layout-Struktur = ❌ nicht eigenständig ändern
> Solar System = ❌ komplett in Ruhe lassen
