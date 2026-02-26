#!/usr/bin/env python3
"""
fix_umlauts.py  —  Ersetzt alle Umlaut-Ersatzschreibungen in index.html
durch korrekte deutsche Umlaute.

Logik:
- <style> und <script> Blöcke werden NICHT verändert
- HTML-Attribute (class=, id=, href=, ...) werden NICHT verändert
- Nur sichtbarer Textinhalt + Meta-Content-Attribute werden korrigiert
"""

import re, sys, shutil
from pathlib import Path

# ── Konfiguration ──────────────────────────────────────────────────────────────
INPUT  = Path('c:/Users/Leon Moretz/FIAE-Landing-Page/index.html')
BACKUP = Path('c:/Users/Leon Moretz/FIAE-Landing-Page/index.html.bak')

# Exakte Ersetzungen: von → nach (Reihenfolge spielt eine Rolle bei Überschneidungen!)
# Längere Muster zuerst, damit "unuebersichtliche" vor "uebersichtliche" greift
REPLACEMENTS = [
    # Groß-Ersetzungen (Ü)
    ('Ueberblick',          'Überblick'),
    ('ueberlastete',        'überlastete'),
    ('unuebersichtliche',   'unübersichtliche'),
    ('unuebersichtlich',    'unübersichtlich'),
    ('Pruefungstermine',    'Prüfungstermine'),
    ('Pruefungen',          'Prüfungen'),
    ('Pruefung',            'Prüfung'),
    ('verschluesselt',      'verschlüsselt'),
    ('verschluesseln',      'verschlüsseln'),
    ('Buecher',             'Bücher'),
    ('Buech',               'Büch'),
    ('schuetzt',            'schützt'),
    ('Schuetzt',            'Schützt'),
    ('zurueck',             'zurück'),
    ('Zurueck',             'Zurück'),

    # fuer / Fuer  (word boundary via space / punctuation)
    ('Fuer ',               'Für '),
    ('Fuer\n',              'Für\n'),
    ('Fuer.',               'Für.'),
    ('Fuer,',               'Für,'),
    ('fuer ',               'für '),
    ('fuer\n',              'für\n'),
    ('fuer.',               'für.'),
    ('fuer,',               'für,'),
    ('fuer<',               'für<'),
    ('Fuer<',               'Für<'),

    # ueber / Ueber
    ('ueber ',              'über '),
    ('ueber\n',             'über\n'),
    ('ueber.',              'über.'),
    ('ueber,',              'über,'),
    ('ueber<',              'über<'),
    ('Ueber ',              'Über '),
    ('Ueber\n',             'Über\n'),
    ('Ueber.',              'Über.'),
    ('Ueber,',              'Über,'),
]

# ── Hilfsfunktionen ────────────────────────────────────────────────────────────
def split_into_parts(html: str):
    """
    Zerlegt HTML in Segmente: abwechselnd Text und Tags.
    <script>/<style>-Blöcke werden als ein einziger 'skip' Block behandelt.
    """
    # Zuerst script/style Blöcke schützen
    SKIP_BLOCK = re.compile(
        r'(<(script|style)[^>]*>.*?</(script|style)>)',
        re.DOTALL | re.IGNORECASE
    )
    # Tags schützen
    TAG = re.compile(r'<[^>]+>', re.DOTALL)

    parts = []  # Liste von (typ, inhalt): typ = 'text' | 'tag' | 'skip'
    pos = 0

    for m in SKIP_BLOCK.finditer(html):
        # Alles vor diesem Block per Tag-Splitting verarbeiten
        before = html[pos:m.start()]
        parts.extend(_split_tags(before))
        parts.append(('skip', m.group(0)))
        pos = m.end()

    # Rest nach letztem skip-Block
    parts.extend(_split_tags(html[pos:]))
    return parts


def _split_tags(fragment: str):
    TAG = re.compile(r'(<[^>]+>)', re.DOTALL)
    result = []
    for seg in TAG.split(fragment):
        if not seg:
            continue
        if seg.startswith('<'):
            result.append(('tag', seg))
        else:
            result.append(('text', seg))
    return result


def apply_replacements(text: str) -> str:
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    return text


def fix_meta_content(tag: str) -> str:
    """Korrigiert nur den content="" Wert von <meta description> Tags."""
    if 'name="description"' not in tag and "name='description'" not in tag:
        return tag
    # Ersetze im content="..." Attribut-Wert
    def repl(m):
        val = m.group(1)
        val = apply_replacements(val)
        return f'content="{val}"'
    return re.sub(r'content="([^"]*)"', repl, tag)


# ── Hauptprogramm ──────────────────────────────────────────────────────────────
def main():
    print(f'Lese {INPUT} ...')
    original = INPUT.read_text(encoding='utf-8')

    parts = split_into_parts(original)

    changes = []
    result_parts = []

    for typ, content in parts:
        if typ == 'skip':
            result_parts.append(content)
        elif typ == 'tag':
            fixed = fix_meta_content(content)
            if fixed != content:
                changes.append(('TAG', content[:80], fixed[:80]))
            result_parts.append(fixed)
        else:  # text
            fixed = apply_replacements(content)
            if fixed != content:
                changes.append(('TXT', repr(content[:60]), repr(fixed[:60])))
            result_parts.append(fixed)

    result = ''.join(result_parts)

    if not changes:
        print('Keine Umlaut-Probleme gefunden — Datei ist bereits korrekt.')
        return

    print(f'\n{len(changes)} Änderungen gefunden:')
    for typ, old, new in changes:
        print(f'  [{typ}]  {old}')
        print(f'        > {new}')

    # Backup erstellen
    shutil.copy2(INPUT, BACKUP)
    print(f'\nBackup erstellt: {BACKUP}')


    # Datei schreiben
    INPUT.write_text(result, encoding='utf-8')
    print(f'Fertig! {INPUT} wurde aktualisiert.')

    # Verifikation
    fixed_content = INPUT.read_text(encoding='utf-8')
    remaining = []
    for old, _ in REPLACEMENTS:
        if old in fixed_content:
            # Check if it's in a script/style block (expected)
            # Quick check: find index
            idx = fixed_content.find(old)
            ctx = fixed_content[max(0,idx-50):idx+50]
            remaining.append(f'  NOCH VORHANDEN: "{old}" @ ...{ctx.strip()[:80]}...')
    if remaining:
        print('\n⚠ Folgende Muster wurden nicht vollständig ersetzt:')
        for r in remaining:
            print(r)
    else:
        print('\nOK: Alle Muster wurden erfolgreich ersetzt.')


if __name__ == '__main__':
    main()
