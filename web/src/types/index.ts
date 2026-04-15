export type ChecklistPhase = 'before' | 'during' | 'after';

export interface ChecklistItemState {
  id: string;
  isChecked: boolean;
  note: string;
}

export interface PhaseState {
  phase: ChecklistPhase;
  items: ChecklistItemState[];
}

export interface ChecklistSession {
  id: string;
  title: string;
  date: string; // ISO string
  phases: PhaseState[];
}

// ── Static content ──────────────────────────────────────────────────────────

export const PHASES: ChecklistPhase[] = ['before', 'during', 'after'];

export const PHASE_LABELS: Record<ChecklistPhase, string> = {
  before: '업무 시작 전',
  during: '업무 진행 중',
  after: '업무 종료 후',
};

export const PHASE_ITEMS: Record<ChecklistPhase, string[]> = {
  before: [
    '이 업무의 목적을 설명할 수 있다.',
    '왜 지금 이 일을 해야 하는지 알고 있다.',
    '기대되는 결과물의 형태와 기준이 명확하다.',
    '내가 잘 아는 부분/막막한 부분을 구분해본다.',
    '도움이나 확인이 필요한 포인트를 미리 정리한다.',
  ],
  during: [
    '처음 세운 방향대로 진행되고 있는지 중간 점검한다.',
    '막히는 이유가 역량 부족인지, 정보 부족인지 파악한다.',
    '시간을 불필요하게 쓰고 있는 부분은 없는지 돌아본다.',
    '감정(조급함, 짜증, 불안)이 판단에 영향을 주고 있지 않는가?',
    '필요한 질문을 미루고 않고 했는가?',
  ],
  after: [
    '잘된 이유/잘 안된 이유를 정리해본다.',
    '나의 판단 중 옳았던 선택은 무엇이었는가?',
    '다음에 같은 일을 한다면 바꾸고 싶은 점은?',
    '성과 대비 과하게 힘을 쓴 부분은?',
    '이 경험을 다른 업무에 적용할 수 있을까?',
  ],
};

// ── Factory helpers ──────────────────────────────────────────────────────────

export function createEmptySession(): ChecklistSession {
  return {
    id: crypto.randomUUID(),
    title: '',
    date: new Date().toISOString(),
    phases: PHASES.map((phase) => ({
      phase,
      items: PHASE_ITEMS[phase].map(() => ({
        id: crypto.randomUUID(),
        isChecked: false,
        note: '',
      })),
    })),
  };
}

export function checkedCount(phase: PhaseState): number {
  return phase.items.filter((i) => i.isChecked).length;
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateShort(isoString: string): string {
  return new Date(isoString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function sessionDisplayTitle(session: ChecklistSession): string {
  const trimmed = session.title.trim();
  return trimmed.length > 0 ? trimmed : formatDate(session.date);
}
