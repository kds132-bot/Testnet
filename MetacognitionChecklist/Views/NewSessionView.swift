import SwiftUI

struct NewSessionView: View {
    @EnvironmentObject var storage: StorageManager
    @Binding var path: [AppRoute]

    @State private var session = ChecklistSession()

    var body: some View {
        List {
            Section {
                TextField("세션 제목 (선택사항)", text: $session.title)
                    .submitLabel(.done)
            } header: {
                Text("세션 정보")
            }

            Section {
                ForEach(ChecklistPhase.allCases, id: \.self) { phase in
                    let state = session.phases.first { $0.phase == phase } ?? PhaseState(phase: phase)
                    PhaseRowButton(phase: phase, state: state) {
                        path.append(.phaseChecklist(
                            phase: phase,
                            initialState: state,
                            sessionID: session.id
                        ))
                    }
                }
            } header: {
                Text("단계별 체크리스트")
            } footer: {
                Text("각 단계를 탭하여 항목을 확인하고 기록하세요.")
            }
        }
        .navigationTitle("새 세션")
        .navigationBarTitleDisplayMode(.inline)
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button("취소") {
                    path = []
                }
                .foregroundStyle(.secondary)
            }
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("저장") {
                    storage.add(session)
                    path = []
                }
                .fontWeight(.semibold)
            }
        }
        .onReceive(
            NotificationCenter.default.publisher(for: .phaseDidUpdate)
        ) { notification in
            guard let updated = notification.object as? PhaseState,
                  let idx = session.phases.firstIndex(where: { $0.phase == updated.phase })
            else { return }
            session.phases[idx] = updated
        }
    }
}

// MARK: - Phase row button

struct PhaseRowButton: View {
    let phase: ChecklistPhase
    let state: PhaseState
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(phase.rawValue)
                        .font(.body)
                        .foregroundStyle(.primary)
                    Text("\(state.checkedCount)/\(state.totalCount) 항목 완료")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundStyle(.tertiary)
            }
        }
        .buttonStyle(.plain)
    }
}
