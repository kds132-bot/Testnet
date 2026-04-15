import SwiftUI

struct SessionDetailView: View {
    let session: ChecklistSession

    var body: some View {
        List {
            Section {
                if !session.title.trimmingCharacters(in: .whitespaces).isEmpty {
                    LabeledContent("제목", value: session.title)
                }
                LabeledContent("날짜", value: DateFormatter.sessionDisplay.string(from: session.date))
            }

            ForEach(session.phases, id: \.phase) { phaseState in
                Section {
                    ForEach(phaseState.items.indices, id: \.self) { index in
                        ReadOnlyItemRow(
                            itemText: phaseState.phase.items[index],
                            item: phaseState.items[index]
                        )
                    }
                } header: {
                    HStack {
                        Text(phaseState.phase.rawValue)
                        Spacer()
                        Text("\(phaseState.checkedCount)/\(phaseState.totalCount)")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
            }
        }
        .listStyle(.insetGrouped)
        .navigationTitle("세션 상세")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Read-only item row

struct ReadOnlyItemRow: View {
    let itemText: String
    let item: ChecklistItemState

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(alignment: .top, spacing: 12) {
                Image(systemName: item.isChecked ? "checkmark.circle.fill" : "circle")
                    .font(.title3)
                    .foregroundStyle(item.isChecked ? .primary : Color(.systemGray3))
                Text(itemText)
                    .font(.body)
                    .foregroundStyle(item.isChecked ? .secondary : .primary)
                    .fixedSize(horizontal: false, vertical: true)
            }
            if !item.note.isEmpty {
                Text(item.note)
                    .font(.callout)
                    .foregroundStyle(.secondary)
                    .padding(.leading, 34)
                    .padding(.top, 2)
            }
        }
        .padding(.vertical, 4)
    }
}
