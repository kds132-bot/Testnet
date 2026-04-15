'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  type ChecklistSession,
  PHASE_LABELS,
  PHASE_ITEMS,
  checkedCount,
  sessionDisplayTitle,
  formatDate,
} from '@/types';
import { getSession, deleteSession } from '@/utils/storage';

export default function SessionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [session, setSession] = useState<ChecklistSession | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const s = getSession(params.id);
    setSession(s ?? null);
    setMounted(true);
  }, [params.id]);

  function handleDelete() {
    if (!confirm('이 세션을 삭제하시겠습니까?')) return;
    deleteSession(params.id);
    router.push('/');
  }

  if (!mounted) return null;

  if (!session) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-gray-500 mb-4">세션을 찾을 수 없습니다.</p>
        <Link href="/" className="btn-secondary inline-block">
          목록으로
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between py-5 sticky top-0 bg-gray-50 z-10">
        <Link href="/" className="text-sm text-gray-500">
          뒤로
        </Link>
        <h1 className="text-base font-semibold text-gray-900">세션 상세</h1>
        <button
          onClick={handleDelete}
          className="text-sm text-gray-400"
        >
          삭제
        </button>
      </div>

      <div className="space-y-6">
        {/* Session info */}
        <div>
          <p className="section-header">세션 정보</p>
          <div className="card divide-y divide-gray-100">
            {session.title.trim() && (
              <InfoRow label="제목" value={session.title} />
            )}
            <InfoRow label="날짜" value={formatDate(session.date)} />
          </div>
        </div>

        {/* Phases */}
        {session.phases.map((phase) => {
          const checked = checkedCount(phase);
          const total = phase.items.length;
          return (
            <div key={phase.phase}>
              <div className="flex items-center justify-between px-1 mb-2">
                <p className="section-header mb-0">{PHASE_LABELS[phase.phase]}</p>
                <span className="text-xs text-gray-400">
                  {checked}/{total}
                </span>
              </div>
              <div className="card divide-y divide-gray-100 overflow-hidden">
                {phase.items.map((item, index) => (
                  <div key={item.id} className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      {/* Status dot */}
                      <div
                        className={`mt-1 w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                          item.isChecked
                            ? 'bg-gray-900 border-gray-900'
                            : 'border-gray-300'
                        }`}
                      >
                        {item.isChecked && (
                          <svg
                            className="w-2.5 h-2.5 text-white"
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
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm leading-snug ${
                            item.isChecked ? 'text-gray-400' : 'text-gray-800'
                          }`}
                        >
                          {PHASE_ITEMS[phase.phase][index]}
                        </p>
                        {item.note.trim() && (
                          <p className="mt-1.5 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                            {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 gap-4">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className="text-sm text-gray-900 text-right">{value}</span>
    </div>
  );
}
