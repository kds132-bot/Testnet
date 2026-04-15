import SwiftUI

struct SessionListView: View {
    @EnvironmentObject var storage: StorageManager
    @Binding var path: [AppRoute]

    var body: some View {
        Group {
            if storage.sessions.isEmpty {
                emptyStateView
            } else {
                sessionList
            }
        }
        .navigationTitle("메타인지 체크리스트")
        .navigationBarTitleDisplayMode(.large)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("새 세션") {
                    path.append(.newSession)
                }
                .fontWeight(.semibold)
            }
        }
    }

    private var emptyStateView: some View {
        VStack(spacing: 16) {
            Text("아직 세션이 없습니다")
                .font(.headline)
                .foregroundStyle(.secondary)
            Text("새 세션을 만들어\n업무 메타인지를 시작해보세요.")
                .font(.subheadline)
                .foregroundStyle(.tertiary)
                .multilineTextAlignment(.center)
            Button("새 세션 만들기") {
                path.append(.newSession)
            }
            .buttonStyle(.bordered)
            .padding(.top, 4)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private var sessionList: some View {
        List {
            ForEach(storage.sessions) { session in
                SessionRowView(session: session)
                    .contentShape(Rectangle())
                    .onTapGesture {
                        path.append(.sessionDetail(session))
                    }
            }
            .onDelete { offsets in
                storage.delete(at: offsets)
            }
        }
        .listStyle(.plain)
    }
}

// MARK: - Row

struct SessionRowView: View {
    let session: ChecklistSession

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(session.displayTitle)
                    .font(.body)
                    .fontWeight(.medium)
                Spacer()
                Text(DateFormatter.dateOnly.string(from: session.date))
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            HStack(spacing: 8) {
                ForEach(session.phases, id: \.phase) { phaseState in
                    PhaseBadgeView(phaseState: phaseState)
                }
            }
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Badge

struct PhaseBadgeView: View {
    let phaseState: PhaseState

    private var label: String {
        switch phaseState.phase {
        case .before: return "시작 전"
        case .during: return "진행 중"
        case .after:  return "종료 후"
        }
    }

    var body: some View {
        HStack(spacing: 3) {
            Text(label)
                .font(.caption2)
            Text("\(phaseState.checkedCount)/\(phaseState.totalCount)")
                .font(.caption2)
        }
        .foregroundStyle(phaseState.isComplete ? .white : .secondary)
        .padding(.horizontal, 8)
        .padding(.vertical, 3)
        .background(
            Capsule()
                .fill(phaseState.isComplete ? Color.primary : Color(.systemGray5))
        )
    }
}
