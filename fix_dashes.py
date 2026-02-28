#!/usr/bin/env python3
"""Replace all em-dashes in index.html with appropriate punctuation."""
import sys, shutil
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')

f = Path('c:/Users/Leon Moretz/FIAE-Landing-Page/index.html')
html = f.read_text(encoding='utf-8')
shutil.copy2(f, 'c:/Users/Leon Moretz/FIAE-Landing-Page/index.html.bak2')

SPECIFIC = [
    # Title
    ('LFA \u2014 Lernplattform', 'LFA: Lernplattform'),
    # Galaxy titles
    ('FIAE \u2014 Lernuniversum', 'FIAE: Lernuniversum'),
    ('Berufsschulfach \u2014 theoretische Grundlage (12', 'Berufsschulfach: theoretische Grundlage (12'),
    ('Pr\u00fcfungseinheit \u2014 begleitet alle Lernfelder (26', 'Pr\u00fcfungseinheit: begleitet alle Lernfelder (26'),
    # Intro
    ('Feedback auf jede Aufgabe \u2014 verankert', 'Feedback auf jede Aufgabe, verankert'),
    # Problem
    ('automatisch generiert \u2014 Ausbilder konzentrieren', 'automatisch generiert. Ausbilder konzentrieren'),
    ('vermittelt \u2014 ohne Szenarien', ', ohne Szenarien'),
    ('entstehen \u2014 Lernen wird greifbar statt abstrakt', '. Lernen wird greifbar, nicht mehr abstrakt'),
    ('n\u00e4chsten Aufgaben \u2014 Azubis organisieren', '. Azubis organisieren'),
    ('Frustrationsabbr\u00fcche \u2014 jeder vermiedene Abbruch', '. Jeder vermiedene Abbruch'),
    ('automatisiert \u2014 Ausbilder gewinnen Zeit', '. Ausbilder gewinnen Zeit'),
    # Rollen
    ('zusammen \u2014 mit klarem Nutzen f\u00fcr beide Seiten.', ', mit klarem Nutzen f\u00fcr beide Seiten.'),
    ('Deadlines \u2014 kein planloses Lernen mehr.', '. Kein planloses Lernen mehr.'),
    ('Quizze statt trockener Theorie \u2014 vorbereitet', ', vorbereitet'),
    ('Fragen jederzeit stellen \u2014 Antworten basieren', '. Antworten basieren'),
    # Warum LFA
    ('Feedback \u2014 abgestimmt auf dich und deinen Lernstand.', ', abgestimmt auf dich und deinen Lernstand.'),
    ('Weniger Verwaltung, mehr pers\u00f6nliche Betreuung \u2014 dein Ausbilder reviewed', '. Dein Ausbilder reviewed'),
    ('Trockene Theorie auf Papier \u2014 ohne Praxisbezug', ', ohne Praxisbezug'),
    ('als Enabler \u2014 daraus entstehen', ': Daraus entstehen'),
    # Funktionen
    ('Module und mehr \u2014 alles in einer Plattform vereint.', ', alles in einer Plattform vereint.'),
    ('mit Fortschrittsverfolgung \u2014 strukturiert nach IHK-Lernfeldern.', ', strukturiert nach IHK-Lernfeldern.'),
    ('Lernempfehlungen \u2014 basierend auf offiziellen IHK-B\u00fcchern.', ', basierend auf offiziellen IHK-B\u00fcchern.'),
    # Solar system
    ('Lernuniversum &mdash; Lernfelder', ': Lernfelder'),
    ('Berufsschulfach \u2014 theoretische Grundlage der IHK-Ausbildung (12 St\u00fcck)', 'Berufsschulfach: theoretische Grundlage der IHK-Ausbildung (12 St\u00fcck)'),
    ('Pr\u00fcfungseinheit \u2014 IHK-Bewertungskategorie, die alle Lernfelder begleitet (26 St\u00fcck)', 'Pr\u00fcfungseinheit: IHK-Bewertungskategorie, begleitet alle Lernfelder (26 St\u00fcck)'),
    ('Praxisaufgabe \u2014 konkrete Situation aus dem Berufsalltag (86 St\u00fcck)', 'Praxisaufgabe: konkrete Situation aus dem Berufsalltag (86 St\u00fcck)'),
    # Demo
    ('interaktive Demo \u2014 wechsle', 'interaktive Demo. Wechsle'),
    # HAI
    ('Nur Antworten aus deinen Kursinhalten &mdash; pr\u00e4zise, ehrlich und lernf\u00f6rdernd.', 'Nur Antworten aus deinen Kursinhalten: pr\u00e4zise, ehrlich und lernf\u00f6rdernd.'),
    ('Du fragst nach Polymorphismus &mdash; guter Einstieg.', 'Du fragst nach Polymorphismus. Guter Einstieg.'),
    ('HAI gibt Hinweise &mdash; keine fertigen L\u00f6sungen. So lernst du wirklich.', 'HAI gibt Hinweise, keine fertigen L\u00f6sungen. So lernst du wirklich.'),
    ('ausschlie\u00dflich aus den eingebetteten Kursmaterialien &mdash; keine Internetsuche im Standardmodus.', 'ausschlie\u00dflich aus den eingebetteten Kursmaterialien. Keine Internetsuche im Standardmodus.'),
    ('Noten, Abgaben, Termine &mdash; HAI erfindet niemals Plattformdaten.', 'Noten, Abgaben, Termine: HAI erfindet niemals Plattformdaten.'),
    ('Hinweise in kleinen Schritten &mdash; und stellt Gegenfragen.', 'Hinweise in kleinen Schritten und stellt Gegenfragen.'),
    ('erkl\u00e4rt was passiert und wo der Fehler liegt &mdash; ohne die L\u00f6sung direkt zu liefern.', 'erkl\u00e4rt, was passiert und wo der Fehler liegt, ohne die L\u00f6sung direkt zu liefern.'),
    ('lerne im Dialog &mdash; kein Raten, echtes Verstehen.', 'lerne im Dialog: kein Raten, echtes Verstehen.'),
    # HAI deep
    ('&mdash; gebaut f\u00fcr echtes Verstehen statt Durchklicken.', '. Gebaut f\u00fcr echtes Verstehen, nicht f\u00fcr Durchklicken.'),
    ('Kosinus \u2265 0,45 &mdash; nur passende Chunks', 'Nur die passenden Inhalte'),
    ('Leitfragen &mdash; keine fertigen L\u00f6sungen', 'Leitfragen, keine fertigen L\u00f6sungen'),
    ('Gut. Schau Enabler\u00a038 &mdash;', 'Gut. Schau dir Abschnitt 38 an,'),
    ('HAI f\u00fchrt dich hin &mdash; gibt keine L\u00f6sungen direkt.', 'HAI f\u00fchrt dich hin, gibt keine L\u00f6sungen direkt.'),
    ('Jede Stufe schaltet nach Bestehen frei &mdash; je Enabler-Quiz 1 Versuch.', 'Jede Stufe schaltet nach Bestehen frei. Je Quiz 1 Versuch.'),
    ('Noten, Termine &mdash; HAI erfindet niemals Plattformdaten', 'Noten, Termine: HAI erfindet niemals Plattformdaten'),
    ('Websuche ist optional &mdash; Standard ist Closed Context', 'Websuche ist optional. Standard: nur deine Kursinhalte'),
    # Architektur
    ('zuverl\u00e4ssig funktioniert \u2014 und deine Daten sch\u00fctzt.', ', und deine Daten sch\u00fctzt.'),
    ('sofort laden \u2014 egal ob im B\u00fcro oder unterwegs.', ', egal ob im B\u00fcro oder unterwegs.'),
    # Roadmap
    ('Kein Feature-Bingo \u2014 sondern echte Alleinstellungsmerkmale,', 'Kein Feature-Bingo, sondern echte Alleinstellungsmerkmale,'),
    ('Firmendaten \u2014 mit Quellenangabe in jeder Antwort.', ', mit Quellenangabe in jeder Antwort.'),
    ('direkt zusammenbringt \u2014 mit pers\u00f6nlichem Feedback,', ', mit pers\u00f6nlichem Feedback,'),
    ('Feedback \u2014 abgestimmt auf deinen Lernstand. Keine generischen Auto-Bewertungen.', ', abgestimmt auf deinen Lernstand. Keine automatischen Bewertungen.'),
    ('greifbar \u2014 nicht abstrakt aus dem Lehrbuch abgelesen.', ', nicht abstrakt aus dem Lehrbuch abgelesen.'),
    ('zum firmenspezifischen Mentor \u2014 mit Wissen,', ', mit Wissen,'),
    ('Massenoperationen \u2014 vereint in einer einzigen Plattform', ', vereint in einer einzigen Plattform'),
    # FAQ
    ('miteinander \u2014 mit pers\u00f6nlichem Feedback auf jede Aufgabe,', ', mit pers\u00f6nlichem Feedback auf jede Aufgabe,'),
    ('Feedback auf jede Aufgabe \u2014 abgestimmt auf deinen Lernstand.', ', abgestimmt auf deinen Lernstand.'),
    # Remaining &mdash; entities (catch-all context: replace with comma)
    ('&mdash;', ','),
]

count = 0
misses = []
for old, new in SPECIFIC:
    if old in html:
        html = html.replace(old, new)
        print(f'  OK  {old[:70]!r}')
        count += 1
    else:
        misses.append(old)

print(f'\n{count} replacements applied.')
if misses:
    print(f'{len(misses)} patterns not found (may already be fixed):')
    for m in misses:
        print(f'  MISS {m[:70]!r}')

# Final check
remaining = html.count('\u2014') + html.count('&mdash;')
print(f'\nRemaining em-dashes: {remaining}')

f.write_text(html, encoding='utf-8')
print('Done.')
