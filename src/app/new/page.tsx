'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  type ChecklistSession,
  type ChecklistPhase,
  type PhaseState,
  PHASES,
  PHASE_LABELS,
  PHASE_ITEMS,
  createEmptySession,
} from '@/types';
import { addSession } from '@/utils/storage';

export default function NewSessionPage() {
  const router = useRouter();
  const [session, setSession] = useState<ChecklistSession>(createEmptySession);
  const [openPhase, setOpenPhase] = useState<ChecklistPhase | null>('before');
  const [noteOpen, setNoteOpen] = useState<Record<string, boolean>>({});

  // ── Updaters ────────────────────────────────────────────────────────────

  function setTitle(title: string) {
    setSession((s) => ({ ...s, title }));
  }

  function toggleItem(phase: ChecklistPhase, itemIndex: number) {
    setSession((s) => ({
      ...s,
      phases: s.phases.map((p) =>
        p.phase !== phase
          ? p
          : {
              ...p,
              items: p.items.map((item, i) =>
                i !== itemIndex ? item : { ...item, isChecked: !item.isChecked }
              ),
            }
      ),
    }));
  }

  function setNote(phase: ChecklistPhase, itemIndex: number, note: string) {
    setSession((s) => ({
      ...s,
      phases: s.phases.map((p) =>
        p.phase !== phase
          ? p
          : {
              ...p,
              items: p.items.map((item, i) =>
                i !== itemIndex ? item : { ...item, note }
              ),
            }
      ),
    }));
  }

  function toggleNote(itemId: string) {
    setNoteOpen((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  }

  function handleSave() {
    addSession(session);
    router.push('/');
  }

  function handleCancel() {
    router.push('/');
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="px-4 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between py-5 sticky top-0 bg-gray-50 z-10">
        <button onClick={handleCancel} className="text-sm text-gray-500">
          취소
        </button>
        <h1 className="text-base font-semibold text-gray-900">새 세션</h1>
        <button
          onClick={handleSave}
          className="text-sm font-semibold text-gray-900"
        >
          저장
        </button>
      </div>

      <div className="space-y-6">
        {/* Title input */}
        <div>
          <p className="section-header">세션 정보</p>
          <div className="card px-4 py-3">
            <input
              type="text"
              placeholder="세션 제목 (선택사항)"
              value={session.title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm text-gray-900 placeholder:text-gray-400 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Phase sections */}
        <div>
          <p className="section-header">단계별 체크리스트</p>
          <div className="space-y-3">
            {PHASES.map((phase) => {
              const phaseState = session.phases.find((p) => p.phase === phase)!;
              return (
                <PhaseSection
                  key={phase}
                  phase={phase}
                  phaseState={phaseState}
                  isOpen={openPhase === phase}
                  noteOpen={noteOpen}
                  onToggleOpen={() =>
                    setOpenPhase((prev) => (prev === phase ? null : phase))
                  }
                  onToggleItem={(i) => toggleItem(phase, i)}
                  onToggleNote={(id) => toggleNote(id)}
                  onChangeNote={(i, note) => setNote(phase, i, note)}
                />
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-2 px-1">
            각 단계를 탭하여 항목을 확인하고 기록하세요.
          </p>
        </div>

        {/* Save button */}
        <button onClick={handleSave} className="btn-primary">
          저장하기
        </button>
      </div>
    </div>
  );
}

// ── Phase section ──────────────────────────────────────────────────────────

function PhaseSection({
  phase,
  phaseState,
  isOpen,
  noteOpen,
  onToggleOpen,
  onToggleItem,
  onToggleNote,
  onChangeNote,
}: {
  phase: ChecklistPhase;
  phaseState: PhaseState;
  isOpen: boolean;
  noteOpen: Record<string, boolean>;
  onToggleOpen: () => void;
  onToggleItem: (index: number) => void;
  onToggleNote: (id: string) => void;
  onChangeNote: (index: number, note: string) => void;
}) {
  const checked = phaseState.items.filter((i) => i.isChecked).length;
  const total = phaseState.items.length;

  return (
    <div className="card overflow-hidden">
      {/* Phase header */}
      <button
        onClick={onToggleOpen}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left"
      >
        <span className="text-sm font-medium text-gray-900">
          {PHASE_LABELS[phase]}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {checked}/{total} 완료
          </span>
          <span className="text-gray-400 text-xs">{isOpen ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Items */}
      {isOpen && (
        <div className="border-t border-gray-100">
          {phaseState.items.map((item, index) => (
            <div
              key={item.id}
              className="px-4 py-3 border-b border-gray-100 last:border-b-0"
            >
              {/* Checkbox row */}
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleItem(index)}
                  className={`mt-0.5 w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                    item.isChecked
                      ? 'bg-gray-900 border-gray-900'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {item.isChecked && (
                    <svg
                      className="w-3 h-3 text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm leading-snug ${
                      item.isChecked ? 'text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {PHASE_ITEMS[phase][index]}
                  </p>

                  {/* Note toggle */}
                  <button
                    onClick={() => onToggleNote(item.id)}
                    className="mt-1.5 text-xs text-gray-400"
                  >
                    {noteOpen[item.id]
                      ? '메모 닫기'
                      : item.note.trim()
                      ? '메모 보기/수정'
                      : '메모 추가'}
                  </button>

                  {/* Note textarea */}
                  {noteOpen[item.id] && (
                    <textarea
                      rows={3}
                      placeholder="메모를 입력하세요"
                      value={item.note}
                      onChange={(e) => onChangeNote(index, e.target.value)}
                      className="mt-2 w-full text-sm text-gray-700 placeholder:text-gray-400
                                 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2
                                 outline-none focus:border-gray-400 resize-none transition-colors"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
