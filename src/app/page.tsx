'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  type ChecklistSession,
  PHASE_LABELS,
  checkedCount,
  sessionDisplayTitle,
  formatDateShort,
} from '@/types';
import { loadSessions, deleteSession } from '@/utils/storage';

export default function HomePage() {
  const [sessions, setSessions] = useState<ChecklistSession[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSessions(loadSessions());
    setMounted(true);
  }, []);

  function handleDelete(id: string) {
    if (!confirm('이 세션을 삭제하시겠습니까?')) return;
    deleteSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  if (!mounted) return null;

  return (
    <div className="px-4 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between py-5 sticky top-0 bg-gray-50 z-10">
        <h1 className="text-xl font-bold text-gray-900">메타인지 체크리스트</h1>
        <Link
          href="/new"
          className="py-2 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg"
        >
          새 세션
        </Link>
      </div>

      {sessions.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-3">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onDelete={() => handleDelete(session.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
      <p className="text-gray-500 font-medium">아직 세션이 없습니다</p>
      <p className="text-sm text-gray-400">
        새 세션을 만들어 업무 메타인지를 시작해보세요.
      </p>
      <Link href="/new" className="mt-2 btn-secondary">
        새 세션 만들기
      </Link>
    </div>
  );
}

function SessionCard({
  session,
  onDelete,
}: {
  session: ChecklistSession;
  onDelete: () => void;
}) {
  return (
    <li className="card px-4 py-4">
      <Link href={`/session/${session.id}`} className="block">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="font-medium text-gray-900 leading-tight">
            {sessionDisplayTitle(session)}
          </span>
          <span className="text-xs text-gray-400 shrink-0 pt-0.5">
            {formatDateShort(session.date)}
          </span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {session.phases.map((phase) => {
            const checked = checkedCount(phase);
            const total = phase.items.length;
            const done = checked === total;
            return (
              <span
                key={phase.phase}
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  done
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {PHASE_LABELS[phase.phase].replace('업무 ', '')} {checked}/{total}
              </span>
            );
          })}
        </div>
      </Link>

      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
        <button
          onClick={onDelete}
          className="text-xs text-gray-400 active:text-red-500 transition-colors"
        >
          삭제
        </button>
      </div>
    </li>
  );
}
