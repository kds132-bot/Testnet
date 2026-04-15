import Foundation

// MARK: - Phase definition

enum ChecklistPhase: String, CaseIterable, Codable, Hashable {
    case before = "업무 시작 전"
    case during = "업무 진행 중"
    case after  = "업무 종료 후"

    var items: [String] {
        switch self {
        case .before:
            return [
                "이 업무의 목적을 설명할 수 있다.",
                "왜 지금 이 일을 해야 하는지 알고 있다.",
                "기대되는 결과물의 형태와 기준이 명확하다.",
                "내가 잘 아는 부분/막막한 부분을 구분해본다.",
                "도움이나 확인이 필요한 포인트를 미리 정리한다."
            ]
        case .during:
            return [
                "처음 세운 방향대로 진행되고 있는지 중간 점검한다.",
                "막히는 이유가 역량 부족인지, 정보 부족인지 파악한다.",
                "시간을 불필요하게 쓰고 있는 부분은 없는지 돌아본다.",
                "감정(조급함, 짜증, 불안)이 판단에 영향을 주고 있지 않는가?",
                "필요한 질문을 미루고 않고 했는가?"
            ]
        case .after:
            return [
                "잘된 이유/잘 안된 이유를 정리해본다.",
                "나의 판단 중 옳았던 선택은 무엇이었는가?",
                "다음에 같은 일을 한다면 바꾸고 싶은 점은?",
                "성과 대비 과하게 힘을 쓴 부분은?",
                "이 경험을 다른 업무에 적용할 수 있을까?"
            ]
        }
    }
}

// MARK: - Per-item state

struct ChecklistItemState: Codable, Identifiable, Equatable, Hashable {
    var id: UUID
    var isChecked: Bool
    var note: String

    init(id: UUID = UUID(), isChecked: Bool = false, note: String = "") {
        self.id = id
        self.isChecked = isChecked
        self.note = note
    }
}

// MARK: - One phase (5 items)

struct PhaseState: Codable, Equatable, Hashable {
    let phase: ChecklistPhase
    var items: [ChecklistItemState]

    init(phase: ChecklistPhase) {
        self.phase = phase
        self.items = phase.items.map { _ in ChecklistItemState() }
    }

    var checkedCount: Int { items.filter(\.isChecked).count }
    var totalCount: Int { items.count }
    var isComplete: Bool { checkedCount == totalCount }
}

// MARK: - Session

struct ChecklistSession: Codable, Identifiable, Equatable, Hashable {
    var id: UUID
    var title: String
    var date: Date
    var phases: [PhaseState]

    init(id: UUID = UUID(), title: String = "", date: Date = Date()) {
        self.id = id
        self.title = title
        self.date = date
        self.phases = ChecklistPhase.allCases.map { PhaseState(phase: $0) }
    }

    func phaseState(for phase: ChecklistPhase) -> PhaseState? {
        phases.first { $0.phase == phase }
    }

    var displayTitle: String {
        let trimmed = title.trimmingCharacters(in: .whitespaces)
        return trimmed.isEmpty
            ? DateFormatter.sessionDisplay.string(from: date)
            : trimmed
    }
}

// MARK: - Date formatters

extension DateFormatter {
    static let sessionDisplay: DateFormatter = {
        let f = DateFormatter()
        f.dateStyle = .medium
        f.timeStyle = .short
        f.locale = Locale(identifier: "ko_KR")
        return f
    }()

    static let dateOnly: DateFormatter = {
        let f = DateFormatter()
        f.dateStyle = .medium
        f.timeStyle = .none
        f.locale = Locale(identifier: "ko_KR")
        return f
    }()
}

// MARK: - Notification name

extension Notification.Name {
    static let phaseDidUpdate = Notification.Name("phaseDidUpdate")
}
