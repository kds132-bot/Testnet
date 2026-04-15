import SwiftUI

@main
struct MetacognitionChecklistApp: App {
    @StateObject private var storage = StorageManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(storage)
        }
    }
}
