// ContentView.swift - EcoWaste Green iOS App V6.4
// Aplicativo iOS nativo completo com todas as funcionalidades

import SwiftUI
import WebKit
import CoreLocation
import AVFoundation
import UserNotifications

struct ContentView: View {
    @StateObject private var appState = AppState()
    @StateObject private var locationManager = LocationManager()
    @StateObject private var cameraManager = CameraManager()
    @State private var showingSplash = true
    
    var body: some View {
        ZStack {
            if showingSplash {
                SplashView()
                    .transition(.opacity)
            } else {
                MainAppView()
                    .environmentObject(appState)
                    .environmentObject(locationManager)
                    .environmentObject(cameraManager)
            }
        }
        .onAppear {
            setupApp()
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
                withAnimation(.easeInOut(duration: 0.8)) {
                    showingSplash = false
                }
            }
        }
    }
    
    private func setupApp() {
        // Configurar notificações
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { _, _ in }
        
        // Configurar localização
        locationManager.requestPermission()
        
        // Configurar câmera
        cameraManager.requestPermission()
    }
}

// MARK: - Splash Screen
struct SplashView: View {
    @State private var scale: CGFloat = 0.5
    @State private var opacity: Double = 0.0
    
    var body: some View {
        ZStack {
            // Gradiente de fundo
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 0.06, green: 0.73, blue: 0.51), // #10b981
                    Color(red: 0.13, green: 0.59, blue: 0.95)  // #2563eb
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            VStack(spacing: 20) {
                // Logo animado
                Image(systemName: "leaf.circle.fill")
                    .font(.system(size: 80))
                    .foregroundColor(.white)
                    .scaleEffect(scale)
                    .opacity(opacity)
                
                // Título
                Text("EcoWaste Green")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .opacity(opacity)
                
                // Subtítulo
                Text("Sustentabilidade Inteligente")
                    .font(.headline)
                    .foregroundColor(.white.opacity(0.9))
                    .opacity(opacity)
                
                // Indicador de carregamento
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    .scaleEffect(1.2)
                    .opacity(opacity)
            }
        }
        .onAppear {
            withAnimation(.easeOut(duration: 1.0)) {
                scale = 1.0
                opacity = 1.0
            }
        }
    }
}

// MARK: - Main App View
struct MainAppView: View {
    @EnvironmentObject var appState: AppState
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            // Dashboard
            DashboardView()
                .tabItem {
                    Image(systemName: "house.fill")
                    Text("Início")
                }
                .tag(0)
            
            // AI Scanner
            AIScannerView()
                .tabItem {
                    Image(systemName: "camera.viewfinder")
                    Text("Scanner IA")
                }
                .tag(1)
            
            // Blockchain
            BlockchainView()
                .tabItem {
                    Image(systemName: "bitcoinsign.circle.fill")
                    Text("ECO Tokens")
                }
                .tag(2)
            
            // Social
            SocialView()
                .tabItem {
                    Image(systemName: "person.3.fill")
                    Text("Comunidade")
                }
                .tag(3)
            
            // Marketplace
            MarketplaceView()
                .tabItem {
                    Image(systemName: "bag.fill")
                    Text("Loja")
                }
                .tag(4)
        }
        .accentColor(Color(red: 0.06, green: 0.73, blue: 0.51))
        .onAppear {
            setupTabBarAppearance()
        }
    }
    
    private func setupTabBarAppearance() {
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor.systemBackground
        
        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
    }
}

// MARK: - Dashboard View
struct DashboardView: View {
    @EnvironmentObject var appState: AppState
    @State private var ecoPoints = 1250
    @State private var recycledItems = 47
    @State private var co2Saved = 23.5
    @State private var showingProfile = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // Header com saudação
                    HStack {
                        VStack(alignment: .leading) {
                            Text("Olá, Eco Warrior! 🌱")
                                .font(.title2)
                                .fontWeight(.bold)
                            
                            Text("Continue salvando o planeta")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                        
                        Spacer()
                        
                        Button(action: { showingProfile = true }) {
                            Image(systemName: "person.circle.fill")
                                .font(.title)
                                .foregroundColor(Color(red: 0.06, green: 0.73, blue: 0.51))
                        }
                    }
                    .padding(.horizontal)
                    
                    // Cards de estatísticas
                    LazyVGrid(columns: [
                        GridItem(.flexible()),
                        GridItem(.flexible())
                    ], spacing: 15) {
                        StatCard(
                            title: "ECO Points",
                            value: "\(ecoPoints)",
                            icon: "leaf.fill",
                            color: .green
                        )
                        
                        StatCard(
                            title: "Itens Reciclados",
                            value: "\(recycledItems)",
                            icon: "arrow.3.trianglepath",
                            color: .blue
                        )
                        
                        StatCard(
                            title: "CO₂ Economizado",
                            value: "\(co2Saved, specifier: "%.1f") kg",
                            icon: "cloud.fill",
                            color: .orange
                        )
                        
                        StatCard(
                            title: "Ranking Global",
                            value: "#342",
                            icon: "trophy.fill",
                            color: .purple
                        )
                    }
                    .padding(.horizontal)
                    
                    // Ações rápidas
                    VStack(alignment: .leading, spacing: 15) {
                        Text("Ações Rápidas")
                            .font(.headline)
                            .fontWeight(.semibold)
                            .padding(.horizontal)
                        
                        LazyVGrid(columns: [
                            GridItem(.flexible()),
                            GridItem(.flexible()),
                            GridItem(.flexible())
                        ], spacing: 15) {
                            QuickActionCard(
                                title: "Escanear",
                                icon: "camera.viewfinder",
                                color: .blue
                            ) {
                                // Ação de escaneamento
                            }
                            
                            QuickActionCard(
                                title: "Postar",
                                icon: "plus.circle.fill",
                                color: .green
                            ) {
                                // Ação de post
                            }
                            
                            QuickActionCard(
                                title: "Trocar",
                                icon: "arrow.left.arrow.right",
                                color: .orange
                            ) {
                                // Ação de troca
                            }
                        }
                        .padding(.horizontal)
                    }
                    
                    // Desafios ativos
                    VStack(alignment: .leading, spacing: 15) {
                        Text("Desafios Ativos")
                            .font(.headline)
                            .fontWeight(.semibold)
                            .padding(.horizontal)
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 15) {
                                ChallengeCard(
                                    title: "Recicle 10 Garrafas",
                                    progress: 0.7,
                                    reward: "50 ECO Points",
                                    icon: "drop.fill"
                                )
                                
                                ChallengeCard(
                                    title: "Compartilhe 5 Posts",
                                    progress: 0.4,
                                    reward: "30 ECO Points",
                                    icon: "square.and.arrow.up.fill"
                                )
                                
                                ChallengeCard(
                                    title: "Economize 5kg CO₂",
                                    progress: 0.9,
                                    reward: "100 ECO Points",
                                    icon: "leaf.fill"
                                )
                            }
                            .padding(.horizontal)
                        }
                    }
                    
                    // Feed de atividades recentes
                    VStack(alignment: .leading, spacing: 15) {
                        Text("Atividades Recentes")
                            .font(.headline)
                            .fontWeight(.semibold)
                            .padding(.horizontal)
                        
                        VStack(spacing: 10) {
                            ActivityRow(
                                icon: "camera.fill",
                                title: "Escaneou garrafa PET",
                                subtitle: "Há 2 horas",
                                points: "+15"
                            )
                            
                            ActivityRow(
                                icon: "person.3.fill",
                                title: "Curtiu post de @maria_eco",
                                subtitle: "Há 4 horas",
                                points: "+2"
                            )
                            
                            ActivityRow(
                                icon: "bag.fill",
                                title: "Trocou por produto sustentável",
                                subtitle: "Ontem",
                                points: "-50"
                            )
                        }
                        .padding(.horizontal)
                    }
                }
                .padding(.vertical)
            }
            .navigationBarHidden(true)
            .refreshable {
                // Atualizar dados
                await refreshData()
            }
        }
        .sheet(isPresented: $showingProfile) {
            ProfileView()
        }
    }
    
    private func refreshData() async {
        // Simular carregamento de dados
        try? await Task.sleep(nanoseconds: 1_000_000_000)
        
        // Atualizar valores (simulado)
        ecoPoints += Int.random(in: 1...10)
        recycledItems += Int.random(in: 0...2)
        co2Saved += Double.random(in: 0.1...1.0)
    }
}

// MARK: - AI Scanner View
struct AIScannerView: View {
    @EnvironmentObject var cameraManager: CameraManager
    @State private var showingCamera = false
    @State private var scannedResult: ScanResult?
    @State private var showingResult = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 30) {
                // Header
                VStack(spacing: 10) {
                    Image(systemName: "camera.viewfinder")
                        .font(.system(size: 60))
                        .foregroundColor(Color(red: 0.06, green: 0.73, blue: 0.51))
                    
                    Text("Scanner IA")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                    
                    Text("Identifique resíduos com inteligência artificial")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }
                
                // Instruções
                VStack(alignment: .leading, spacing: 15) {
                    InstructionRow(
                        icon: "1.circle.fill",
                        text: "Aponte a câmera para o resíduo"
                    )
                    
                    InstructionRow(
                        icon: "2.circle.fill",
                        text: "Aguarde a identificação automática"
                    )
                    
                    InstructionRow(
                        icon: "3.circle.fill",
                        text: "Receba pontos e dicas de descarte"
                    )
                }
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(15)
                
                Spacer()
                
                // Botão de escaneamento
                Button(action: {
                    showingCamera = true
                }) {
                    HStack {
                        Image(systemName: "camera.fill")
                        Text("Iniciar Scanner")
                            .fontWeight(.semibold)
                    }
                    .font(.title2)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(
                        LinearGradient(
                            gradient: Gradient(colors: [
                                Color(red: 0.06, green: 0.73, blue: 0.51),
                                Color(red: 0.13, green: 0.59, blue: 0.95)
                            ]),
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .cornerRadius(15)
                }
                .padding(.horizontal)
                
                // Histórico de escaneamentos
                VStack(alignment: .leading, spacing: 10) {
                    Text("Escaneamentos Recentes")
                        .font(.headline)
                        .fontWeight(.semibold)
                    
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 15) {
                            ScanHistoryCard(
                                item: "Garrafa PET",
                                category: "Plástico",
                                points: 15,
                                date: "Hoje"
                            )
                            
                            ScanHistoryCard(
                                item: "Lata de Alumínio",
                                category: "Metal",
                                points: 20,
                                date: "Ontem"
                            )
                            
                            ScanHistoryCard(
                                item: "Papel Jornal",
                                category: "Papel",
                                points: 10,
                                date: "2 dias"
                            )
                        }
                    }
                }
                .padding(.horizontal)
                
                Spacer()
            }
            .padding()
            .navigationBarHidden(true)
        }
        .fullScreenCover(isPresented: $showingCamera) {
            CameraView { result in
                scannedResult = result
                showingResult = true
                showingCamera = false
            }
        }
        .sheet(isPresented: $showingResult) {
            if let result = scannedResult {
                ScanResultView(result: result)
            }
        }
    }
}

// MARK: - Supporting Views e Components
struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 10) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(color)
            
            Text(value)
                .font(.title2)
                .fontWeight(.bold)
            
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(15)
        .shadow(color: .black.opacity(0.1), radius: 5, x: 0, y: 2)
    }
}

struct QuickActionCard: View {
    let title: String
    let icon: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundColor(color)
                
                Text(title)
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundColor(.primary)
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
        }
    }
}

struct ChallengeCard: View {
    let title: String
    let progress: Double
    let reward: String
    let icon: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(Color(red: 0.06, green: 0.73, blue: 0.51))
                
                Spacer()
                
                Text(reward)
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(Color(red: 0.06, green: 0.73, blue: 0.51))
            }
            
            Text(title)
                .font(.subheadline)
                .fontWeight(.medium)
            
            ProgressView(value: progress)
                .progressViewStyle(LinearProgressViewStyle(tint: Color(red: 0.06, green: 0.73, blue: 0.51)))
            
            Text("\(Int(progress * 100))% completo")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .frame(width: 200)
        .background(Color(.systemBackground))
        .cornerRadius(15)
        .shadow(color: .black.opacity(0.1), radius: 5, x: 0, y: 2)
    }
}

struct ActivityRow: View {
    let icon: String
    let title: String
    let subtitle: String
    let points: String
    
    var body: some View {
        HStack {
            Image(systemName: icon)
                .font(.title3)
                .foregroundColor(Color(red: 0.06, green: 0.73, blue: 0.51))
                .frame(width: 30)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                
                Text(subtitle)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            Text(points)
                .font(.subheadline)
                .fontWeight(.semibold)
                .foregroundColor(points.hasPrefix("+") ? .green : .red)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct InstructionRow: View {
    let icon: String
    let text: String
    
    var body: some View {
        HStack(spacing: 15) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundColor(Color(red: 0.06, green: 0.73, blue: 0.51))
            
            Text(text)
                .font(.subheadline)
            
            Spacer()
        }
    }
}

struct ScanHistoryCard: View {
    let item: String
    let category: String
    let points: Int
    let date: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(item)
                .font(.subheadline)
                .fontWeight(.medium)
            
            Text(category)
                .font(.caption)
                .foregroundColor(.secondary)
            
            HStack {
                Text("+\(points) pts")
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(.green)
                
                Spacer()
                
                Text(date)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .frame(width: 120)
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

// MARK: - Data Models
class AppState: ObservableObject {
    @Published var isLoggedIn = false
    @Published var user: User?
    @Published var ecoPoints = 0
    @Published var notifications: [AppNotification] = []
}

class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate {
    private let manager = CLLocationManager()
    @Published var location: CLLocation?
    @Published var authorizationStatus: CLAuthorizationStatus = .notDetermined
    
    override init() {
        super.init()
        manager.delegate = self
    }
    
    func requestPermission() {
        manager.requestWhenInUseAuthorization()
    }
    
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        authorizationStatus = status
        if status == .authorizedWhenInUse || status == .authorizedAlways {
            manager.startUpdatingLocation()
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        location = locations.last
    }
}

class CameraManager: NSObject, ObservableObject {
    @Published var authorizationStatus: AVAuthorizationStatus = .notDetermined
    
    func requestPermission() {
        AVCaptureDevice.requestAccess(for: .video) { granted in
            DispatchQueue.main.async {
                self.authorizationStatus = granted ? .authorized : .denied
            }
        }
    }
}

struct User {
    let id: String
    let name: String
    let email: String
    let ecoPoints: Int
    let level: Int
}

struct AppNotification {
    let id: String
    let title: String
    let message: String
    let date: Date
    let isRead: Bool
}

struct ScanResult {
    let item: String
    let category: String
    let confidence: Double
    let points: Int
    let disposalTips: [String]
    let image: UIImage?
}

// MARK: - Additional Views (Placeholders)
struct BlockchainView: View {
    var body: some View {
        Text("Blockchain View - Em desenvolvimento")
            .navigationTitle("ECO Tokens")
    }
}

struct SocialView: View {
    var body: some View {
        Text("Social View - Em desenvolvimento")
            .navigationTitle("Comunidade")
    }
}

struct MarketplaceView: View {
    var body: some View {
        Text("Marketplace View - Em desenvolvimento")
            .navigationTitle("Loja")
    }
}

struct ProfileView: View {
    var body: some View {
        Text("Profile View - Em desenvolvimento")
            .navigationTitle("Perfil")
    }
}

struct CameraView: View {
    let onScanComplete: (ScanResult) -> Void
    
    var body: some View {
        Text("Camera View - Em desenvolvimento")
            .navigationTitle("Scanner")
    }
}

struct ScanResultView: View {
    let result: ScanResult
    
    var body: some View {
        Text("Scan Result View - Em desenvolvimento")
            .navigationTitle("Resultado")
    }
}

// MARK: - Preview
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
