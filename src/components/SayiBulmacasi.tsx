import React, { useMemo, useState } from 'react';

// ---------------------------------------------------------------------------
// SayiBulmacasi.tsx — Zeka-Dikkat 7. kategori adayı
//
// TODO (entegrasyon noktaları — bunlar projenin mevcut yapısına göre
// senin/Cursor'ın doldurması gerekiyor, ben tahmin ederek yanlış API
// uydurmak istemedim):
//   1) Stats yazımı: onPuzzleComplete QuizViewer'da dersdunyasi_<isim>_stats'a
//      DenemeSinavi ile aynı kayıt şekline bağlandı.
//   2) Stil: renk ve font QuizViewer :root token'larını (--qv-*) kullanır.
//   3) TTS/karaoke okuma isteğe bağlı, bu bileşene henüz bağlanmadı.
// ---------------------------------------------------------------------------

// Generator'ın (gen_sayi_bulmacasi.mjs) ürettiği JSON şekli
interface RowEquation {
  a: number;
  op: '+' | '-' | '×' | '÷';
  b: number;
  result: number;
}

interface VerticalGroup {
  rows: [number, number, number];
  op: '+' | '-' | '×' | '÷';
}

interface Block {
  rows: RowEquation[];
  verticalGroups: VerticalGroup[];
  col2: number[];
  blanked: string[]; // örn: ["r0c1", "r2c2"]
}

interface Puzzle {
  id: string;
  sinif: number;
  tema: string;
  blocks: Block[];
}

// Statik importlar — no-fetch kuralı: build-time'da bundle'a gömülür
import puzzles2 from '../data/sayibulmacasi/2_sinif.json';
import puzzles3 from '../data/sayibulmacasi/3_sinif.json';
import puzzles4 from '../data/sayibulmacasi/4_sinif.json';

const PUZZLES_BY_SINIF: Record<number, Puzzle[]> = {
  2: puzzles2 as Puzzle[],
  3: puzzles3 as Puzzle[],
  4: puzzles4 as Puzzle[],
};

type CellStatus = 'empty' | 'correct' | 'incorrect';

interface SayiBulmacasiProps {
  sinif: 2 | 3 | 4;
  onPuzzleComplete?: (result: { puzzleId: string; sinif: number; correctOnFirstTry: boolean }) => void;
}

function pickRandomPuzzle(sinif: number): Puzzle {
  const pool = PUZZLES_BY_SINIF[sinif] || [];
  return pool[Math.floor(Math.random() * pool.length)];
}

// Bir bloğun görsel satır listesini üretir: sayı satırları arasına,
// aynı dikey grup içindeyse işlem/= satırlarını serpiştirir.
type VisualRow =
  | { kind: 'numbers'; rowIndex: number }
  | { kind: 'vsymbol'; symbol: string };

function buildVisualRows(block: Block): VisualRow[] {
  const visual: VisualRow[] = [];
  block.rows.forEach((_, r) => {
    visual.push({ kind: 'numbers', rowIndex: r });
    const posInGroup = r % 3;
    const group = block.verticalGroups.find((g) => g.rows.includes(r));
    if (posInGroup === 0 && group) visual.push({ kind: 'vsymbol', symbol: group.op });
    if (posInGroup === 1 && group) visual.push({ kind: 'vsymbol', symbol: '=' });
  });
  return visual;
}

function cellValue(block: Block, row: number, col: 0 | 1 | 2): number {
  const eq = block.rows[row];
  return col === 0 ? eq.a : col === 1 ? eq.b : eq.result;
}

function cellKey(row: number, col: 0 | 1 | 2): string {
  return `r${row}c${col}`;
}

export default function SayiBulmacasi({ sinif, onPuzzleComplete }: SayiBulmacasiProps) {
  const [puzzle, setPuzzle] = useState<Puzzle>(() => pickRandomPuzzle(sinif));
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, CellStatus>>({});
  const [checked, setChecked] = useState(false);
  const [firstTryClean, setFirstTryClean] = useState(true);

  const blankKeys = useMemo(
    () => new Set(puzzle.blocks.flatMap((b) => b.blanked)),
    [puzzle]
  );

  function handleChange(key: string, value: string) {
    if (checked) {
      // yeniden düzenlemeye başlayınca durum sıfırlanır
      setChecked(false);
      setStatuses({});
    }
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function handleCheck() {
    const newStatuses: Record<string, CellStatus> = {};
    let allCorrect = true;
    puzzle.blocks.forEach((block) => {
      block.blanked.forEach((key) => {
        const [, rowStr, colStr] = key.match(/r(\d+)c(\d+)/) || [];
        const row = parseInt(rowStr, 10);
        const col = parseInt(colStr, 10) as 0 | 1 | 2;
        const trueValue = cellValue(block, row, col);
        const userValue = parseInt(answers[key] ?? '', 10);
        const isCorrect = userValue === trueValue;
        newStatuses[key] = answers[key] ? (isCorrect ? 'correct' : 'incorrect') : 'empty';
        if (!isCorrect) allCorrect = false;
      });
    });
    setStatuses(newStatuses);
    setChecked(true);
    if (allCorrect) {
      onPuzzleComplete?.({ puzzleId: puzzle.id, sinif: puzzle.sinif, correctOnFirstTry: firstTryClean });
    } else {
      setFirstTryClean(false);
    }
  }

  function handleNewPuzzle() {
    setPuzzle(pickRandomPuzzle(sinif));
    setAnswers({});
    setStatuses({});
    setChecked(false);
    setFirstTryClean(true);
  }

  const allBlanksCorrect =
    checked && puzzle.blocks.every((b) => b.blanked.every((k) => statuses[k] === 'correct'));

  return (
    <div className="sb-wrap">
      <style>{`
        .sb-wrap { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 16px; font-family: var(--qv-font); color: var(--qv-text); }
        .sb-blocks { display: flex; flex-wrap: wrap; gap: 32px; justify-content: center; }
        .sb-grid { display: grid; grid-template-columns: 64px 40px 64px 40px 64px; align-items: center; row-gap: 6px; }
        .sb-cell-num { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-size: 20px; font-weight: 700; border: 3px solid var(--qv-border); background: var(--qv-surface); }
        .sb-cell-num.given { background: var(--qv-purple-l); border-color: var(--qv-purple); }
        .sb-cell-input { width: 56px; height: 56px; border-radius: 50%; text-align: center; font-size: 18px; font-weight: 700;
          border: 3px solid var(--qv-border); background: var(--qv-surface); color: var(--qv-text); outline: none; font-family: var(--qv-font); }
        .sb-cell-input.correct { border-color: var(--qv-green); background: var(--qv-green-l); }
        .sb-cell-input.incorrect { border-color: var(--qv-red); background: var(--qv-red-l); }
        .sb-sym { font-size: 22px; font-weight: 800; text-align: center; color: var(--qv-text); }
        .sb-btn { padding: 10px 28px; border-radius: 999px; font-size: 16px; font-weight: 700; border: none; cursor: pointer; font-family: var(--qv-font); }
        .sb-btn-check { background: var(--qv-purple); color: #fff; }
        .sb-btn-new { background: var(--qv-border); color: var(--qv-text); }
        .sb-banner { font-size: 18px; font-weight: 700; }
        .sb-banner.ok { color: var(--qv-green); }
        .sb-banner.retry { color: var(--qv-red); }
      `}</style>

      <div className="sb-blocks">
        {puzzle.blocks.map((block, bIdx) => {
          const visualRows = buildVisualRows(block);
          return (
            <div className="sb-grid" key={bIdx}>
              {visualRows.map((vrow, i) => {
                if (vrow.kind === 'vsymbol') {
                  return (
                    <React.Fragment key={i}>
                      <div />
                      <div />
                      <div />
                      <div />
                      <div className="sb-sym">{vrow.symbol}</div>
                    </React.Fragment>
                  );
                }
                const r = vrow.rowIndex;
                const eq = block.rows[r];
                const cols: Array<0 | 1 | 2> = [0, 1, 2];
                return (
                  <React.Fragment key={i}>
                    {renderCell(block, r, cols[0])}
                    <div className="sb-sym">{eq.op}</div>
                    {renderCell(block, r, cols[1])}
                    <div className="sb-sym">=</div>
                    {renderCell(block, r, cols[2])}
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}
      </div>

      {checked && (
        <div className={`sb-banner ${allBlanksCorrect ? 'ok' : 'retry'}`}>
          {allBlanksCorrect ? 'Harika! Hepsi doğru! 🎉' : 'Bazıları yanlış, kırmızıları düzelt.'}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="sb-btn sb-btn-check" onClick={handleCheck}>
          Kontrol Et
        </button>
        <button className="sb-btn sb-btn-new" onClick={handleNewPuzzle}>
          Yeni Bulmaca
        </button>
      </div>
    </div>
  );

  function renderCell(block: Block, row: number, col: 0 | 1 | 2) {
    const key = cellKey(row, col);
    const isBlank = blankKeys.has(key) && block.blanked.includes(key);
    if (!isBlank) {
      return (
        <div className="sb-cell-num given" key={key}>
          {cellValue(block, row, col)}
        </div>
      );
    }
    const status = statuses[key];
    return (
      <input
        key={key}
        className={`sb-cell-input ${status === 'correct' ? 'correct' : status === 'incorrect' ? 'incorrect' : ''}`}
        type="number"
        inputMode="numeric"
        value={answers[key] ?? ''}
        onChange={(e) => handleChange(key, e.target.value)}
      />
    );
  }
}
