import SwiftUI

struct PhaseChecklistView: View {
    let phase: ChecklistPhase
    let sessionID: UUID
    @Binding var path: [AppRoute]

    @State private var phaseState: PhaseState

    init(phase: ChecklistPhase, sessionID: UUID, initialState: PhaseState, path: Binding<[AppRoute]>) {
        self.phase = phase
        self.sessionID = sessionID
        self._path = path
        self._phaseState = State(initialValue: initialState)
    }

    var body: some View {
        List {
            ForEach(phaseState.items.indices, id: \.self) { index in
                ChecklistItemRow(
                    itemText: phase.items[index],
                    itemState: $phaseState.items[index]
                )
            }
        }
        .listStyle(.insetGrouped)
        .navigationTitle(phase.rawValue)
        .navigationBarTitleDisplayMode(.inline)
        .onDisappear {
            NotificationCenter.default.post(
                name: .phaseDidUpdate,
                object: phaseState
            )
        }
    }
}

// MARK: - Single item row

struct ChecklistItemRow: View {
    let itemText: String
    @Binding var itemState: ChecklistItemState

    @State private var isNoteExpanded = false

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(alignment: .top, spacing: 12) {
                Button {
                    itemState.isChecked.toggle()
                } label: {
                    Image(systemName: itemState.isChecked ? "checkmark.circle.fill" : "circle")
                        .font(.title3)
                        .foregroundStyle(itemState.isChecked ? .primary : Color(.systemGray3))
                        .animation(.easeInOut(duration: 0.15), value: itemState.isChecked)
                }
                .buttonStyle(.plain)

                VStack(alignment: .leading, spacing: 6) {
                    Text(itemText)
                        .font(.body)
                        .foregroundStyle(itemState.isChecked ? .secondary : .primary)
                        .fixedSize(horizontal: false, vertical: true)

                    Button {
                        withAnimation(.easeInOut(duration: 0.2)) {
                            isNoteExpanded.toggle()
                        }
                    } label: {
                        Text(isNoteExpanded
                             ? "메모 닫기"
                             : (itemState.note.isEmpty ? "메모 추가" : "메모 보기/수정"))
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    .buttonStyle(.plain)

                    if isNoteExpanded {
                        TextField("메모를 입력하세요", text: $itemState.note, axis: .vertical)
                            .font(.callout)
                            .lineLimit(3...6)
                            .padding(8)
                            .background(Color(.systemGray6))
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                            .transition(.opacity.combined(with: .move(edge: .top)))
                    }
                }
            }
            .padding(.vertical, 8)
        }
    }
}
