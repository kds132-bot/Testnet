import SwiftUI

// MARK: - Navigation routes

enum AppRoute: Hashable {
    case newSession
    case sessionDetail(ChecklistSession)
    case phaseChecklist(phase: ChecklistPhase, initialState: PhaseState, sessionID: UUID)
}

// MARK: - Root view

struct ContentView: View {
    @State private var path: [AppRoute] = []

    var body: some View {
        NavigationStack(path: $path) {
            SessionListView(path: $path)
                .navigationDestination(for: AppRoute.self) { route in
                    switch route {
                    case .newSession:
                        NewSessionView(path: $path)
                    case .sessionDetail(let session):
                        SessionDetailView(session: session)
                    case .phaseChecklist(let phase, let initialState, let sessionID):
                        PhaseChecklistView(
                            phase: phase,
                            sessionID: sessionID,
                            initialState: initialState,
                            path: $path
                        )
                    }
                }
        }
    }
}
