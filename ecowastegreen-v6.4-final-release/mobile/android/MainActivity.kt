// MainActivity.kt - EcoWaste Green Android App V6.4
// Aplicativo Android nativo completo com todas as funcionalidades

package com.ecowastegreen.app

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class MainActivity : ComponentActivity() {
    
    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        // Lidar com permissões concedidas/negadas
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Solicitar permissões necessárias
        requestPermissions()
        
        setContent {
            EcoWasteGreenTheme {
                EcoWasteGreenApp()
            }
        }
    }
    
    private fun requestPermissions() {
        val permissions = arrayOf(
            Manifest.permission.CAMERA,
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.POST_NOTIFICATIONS
        )
        
        val permissionsToRequest = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }
        
        if (permissionsToRequest.isNotEmpty()) {
            requestPermissionLauncher.launch(permissionsToRequest.toTypedArray())
        }
    }
}

// MARK: - Theme
@Composable
fun EcoWasteGreenTheme(content: @Composable () -> Unit) {
    val colorScheme = lightColorScheme(
        primary = Color(0xFF10B981), // Verde principal
        secondary = Color(0xFF2563EB), // Azul secundário
        tertiary = Color(0xFFF59E0B), // Laranja
        background = Color(0xFFFAFAFA),
        surface = Color.White,
        onPrimary = Color.White,
        onSecondary = Color.White,
        onBackground = Color(0xFF1F2937),
        onSurface = Color(0xFF1F2937)
    )
    
    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}

// MARK: - Main App
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EcoWasteGreenApp() {
    val navController = rememberNavController()
    var showSplash by remember { mutableStateOf(true) }
    
    LaunchedEffect(Unit) {
        delay(2500)
        showSplash = false
    }
    
    if (showSplash) {
        SplashScreen()
    } else {
        MainApp(navController)
    }
}

// MARK: - Splash Screen
@Composable
fun SplashScreen() {
    var scale by remember { mutableStateOf(0.5f) }
    var alpha by remember { mutableStateOf(0f) }
    
    LaunchedEffect(Unit) {
        animate(
            initialValue = 0.5f,
            targetValue = 1f,
            animationSpec = tween(1000, easing = EaseOut)
        ) { value, _ ->
            scale = value
        }
        
        animate(
            initialValue = 0f,
            targetValue = 1f,
            animationSpec = tween(1000, easing = EaseOut)
        ) { value, _ ->
            alpha = value
        }
    }
    
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.linearGradient(
                    colors = listOf(
                        Color(0xFF10B981),
                        Color(0xFF2563EB)
                    )
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            // Logo animado
            Icon(
                imageVector = Icons.Default.Eco,
                contentDescription = "Logo",
                modifier = Modifier
                    .size(80.dp)
                    .graphicsLayer(
                        scaleX = scale,
                        scaleY = scale,
                        alpha = alpha
                    ),
                tint = Color.White
            )
            
            // Título
            Text(
                text = "EcoWaste Green",
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                modifier = Modifier.graphicsLayer(alpha = alpha)
            )
            
            // Subtítulo
            Text(
                text = "Sustentabilidade Inteligente",
                fontSize = 16.sp,
                color = Color.White.copy(alpha = 0.9f),
                modifier = Modifier.graphicsLayer(alpha = alpha)
            )
            
            // Indicador de carregamento
            CircularProgressIndicator(
                color = Color.White,
                modifier = Modifier
                    .size(24.dp)
                    .graphicsLayer(alpha = alpha)
            )
        }
    }
}

// MARK: - Main App with Navigation
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainApp(navController: NavController) {
    val appViewModel: AppViewModel = viewModel()
    
    Scaffold(
        bottomBar = {
            BottomNavigationBar(navController)
        }
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = "dashboard",
            modifier = Modifier.padding(paddingValues)
        ) {
            composable("dashboard") {
                DashboardScreen(appViewModel)
            }
            composable("scanner") {
                AIScannerScreen(appViewModel)
            }
            composable("blockchain") {
                BlockchainScreen(appViewModel)
            }
            composable("social") {
                SocialScreen(appViewModel)
            }
            composable("marketplace") {
                MarketplaceScreen(appViewModel)
            }
        }
    }
}

// MARK: - Bottom Navigation
@Composable
fun BottomNavigationBar(navController: NavController) {
    val items = listOf(
        BottomNavItem("dashboard", "Início", Icons.Default.Home),
        BottomNavItem("scanner", "Scanner IA", Icons.Default.CameraAlt),
        BottomNavItem("blockchain", "ECO Tokens", Icons.Default.MonetizationOn),
        BottomNavItem("social", "Comunidade", Icons.Default.People),
        BottomNavItem("marketplace", "Loja", Icons.Default.ShoppingBag)
    )
    
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route
    
    NavigationBar(
        containerColor = Color.White,
        contentColor = Color(0xFF10B981)
    ) {
        items.forEach { item ->
            NavigationBarItem(
                icon = {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = item.title
                    )
                },
                label = {
                    Text(
                        text = item.title,
                        fontSize = 10.sp
                    )
                },
                selected = currentRoute == item.route,
                onClick = {
                    navController.navigate(item.route) {
                        popUpTo(navController.graph.startDestinationId)
                        launchSingleTop = true
                    }
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = Color(0xFF10B981),
                    selectedTextColor = Color(0xFF10B981),
                    unselectedIconColor = Color.Gray,
                    unselectedTextColor = Color.Gray,
                    indicatorColor = Color(0xFF10B981).copy(alpha = 0.1f)
                )
            )
        }
    }
}

// MARK: - Dashboard Screen
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(viewModel: AppViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        // Header
        item {
            DashboardHeader()
        }
        
        // Stats Cards
        item {
            StatsGrid(uiState)
        }
        
        // Quick Actions
        item {
            QuickActionsSection()
        }
        
        // Active Challenges
        item {
            ActiveChallengesSection()
        }
        
        // Recent Activities
        item {
            RecentActivitiesSection()
        }
    }
}

@Composable
fun DashboardHeader() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(
                text = "Olá, Eco Warrior! 🌱",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            Text(
                text = "Continue salvando o planeta",
                fontSize = 14.sp,
                color = Color.Gray
            )
        }
        
        IconButton(
            onClick = { /* Abrir perfil */ }
        ) {
            Icon(
                imageVector = Icons.Default.AccountCircle,
                contentDescription = "Perfil",
                modifier = Modifier.size(32.dp),
                tint = Color(0xFF10B981)
            )
        }
    }
}

@Composable
fun StatsGrid(uiState: AppUiState) {
    LazyVerticalGrid(
        columns = GridCells.Fixed(2),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = Modifier.height(200.dp)
    ) {
        item {
            StatCard(
                title = "ECO Points",
                value = uiState.ecoPoints.toString(),
                icon = Icons.Default.Eco,
                color = Color(0xFF10B981)
            )
        }
        
        item {
            StatCard(
                title = "Itens Reciclados",
                value = uiState.recycledItems.toString(),
                icon = Icons.Default.Recycling,
                color = Color(0xFF2563EB)
            )
        }
        
        item {
            StatCard(
                title = "CO₂ Economizado",
                value = "${uiState.co2Saved} kg",
                icon = Icons.Default.Cloud,
                color = Color(0xFFF59E0B)
            )
        }
        
        item {
            StatCard(
                title = "Ranking Global",
                value = "#${uiState.globalRank}",
                icon = Icons.Default.EmojiEvents,
                color = Color(0xFF8B5CF6)
            )
        }
    }
}

@Composable
fun StatCard(
    title: String,
    value: String,
    icon: ImageVector,
    color: Color
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(90.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color.White
        ),
        elevation = CardDefaults.cardElevation(
            defaultElevation = 4.dp
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceEvenly
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = color,
                modifier = Modifier.size(24.dp)
            )
            
            Text(
                text = value,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            
            Text(
                text = title,
                fontSize = 10.sp,
                color = Color.Gray,
                textAlign = TextAlign.Center
            )
        }
    }
}

@Composable
fun QuickActionsSection() {
    Column {
        Text(
            text = "Ações Rápidas",
            fontSize = 18.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color(0xFF1F2937),
            modifier = Modifier.padding(bottom = 12.dp)
        )
        
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            QuickActionCard(
                title = "Escanear",
                icon = Icons.Default.CameraAlt,
                color = Color(0xFF2563EB),
                modifier = Modifier.weight(1f)
            ) {
                // Ação de escaneamento
            }
            
            QuickActionCard(
                title = "Postar",
                icon = Icons.Default.Add,
                color = Color(0xFF10B981),
                modifier = Modifier.weight(1f)
            ) {
                // Ação de post
            }
            
            QuickActionCard(
                title = "Trocar",
                icon = Icons.Default.SwapHoriz,
                color = Color(0xFFF59E0B),
                modifier = Modifier.weight(1f)
            ) {
                // Ação de troca
            }
        }
    }
}

@Composable
fun QuickActionCard(
    title: String,
    icon: ImageVector,
    color: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier
            .height(80.dp)
            .clickable { onClick() },
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFFF9FAFB)
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = color,
                modifier = Modifier.size(24.dp)
            )
            
            Spacer(modifier = Modifier.height(4.dp))
            
            Text(
                text = title,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF1F2937)
            )
        }
    }
}

@Composable
fun ActiveChallengesSection() {
    Column {
        Text(
            text = "Desafios Ativos",
            fontSize = 18.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color(0xFF1F2937),
            modifier = Modifier.padding(bottom = 12.dp)
        )
        
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                ChallengeCard(
                    title = "Recicle 10 Garrafas",
                    progress = 0.7f,
                    reward = "50 ECO Points",
                    icon = Icons.Default.LocalDrink
                )
            }
            
            item {
                ChallengeCard(
                    title = "Compartilhe 5 Posts",
                    progress = 0.4f,
                    reward = "30 ECO Points",
                    icon = Icons.Default.Share
                )
            }
            
            item {
                ChallengeCard(
                    title = "Economize 5kg CO₂",
                    progress = 0.9f,
                    reward = "100 ECO Points",
                    icon = Icons.Default.Eco
                )
            }
        }
    }
}

@Composable
fun ChallengeCard(
    title: String,
    progress: Float,
    reward: String,
    icon: ImageVector
) {
    Card(
        modifier = Modifier
            .width(180.dp)
            .height(120.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color.White
        ),
        elevation = CardDefaults.cardElevation(
            defaultElevation = 4.dp
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = title,
                    tint = Color(0xFF10B981),
                    modifier = Modifier.size(20.dp)
                )
                
                Text(
                    text = reward,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF10B981)
                )
            }
            
            Text(
                text = title,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF1F2937)
            )
            
            Column {
                LinearProgressIndicator(
                    progress = progress,
                    modifier = Modifier.fillMaxWidth(),
                    color = Color(0xFF10B981),
                    trackColor = Color(0xFFE5E7EB)
                )
                
                Spacer(modifier = Modifier.height(4.dp))
                
                Text(
                    text = "${(progress * 100).toInt()}% completo",
                    fontSize = 10.sp,
                    color = Color.Gray
                )
            }
        }
    }
}

@Composable
fun RecentActivitiesSection() {
    Column {
        Text(
            text = "Atividades Recentes",
            fontSize = 18.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color(0xFF1F2937),
            modifier = Modifier.padding(bottom = 12.dp)
        )
        
        Column(
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            ActivityRow(
                icon = Icons.Default.CameraAlt,
                title = "Escaneou garrafa PET",
                subtitle = "Há 2 horas",
                points = "+15"
            )
            
            ActivityRow(
                icon = Icons.Default.People,
                title = "Curtiu post de @maria_eco",
                subtitle = "Há 4 horas",
                points = "+2"
            )
            
            ActivityRow(
                icon = Icons.Default.ShoppingBag,
                title = "Trocou por produto sustentável",
                subtitle = "Ontem",
                points = "-50"
            )
        }
    }
}

@Composable
fun ActivityRow(
    icon: ImageVector,
    title: String,
    subtitle: String,
    points: String
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFFF9FAFB)
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = Color(0xFF10B981),
                modifier = Modifier.size(24.dp)
            )
            
            Spacer(modifier = Modifier.width(12.dp))
            
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = title,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFF1F2937)
                )
                
                Text(
                    text = subtitle,
                    fontSize = 12.sp,
                    color = Color.Gray
                )
            }
            
            Text(
                text = points,
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = if (points.startsWith("+")) Color(0xFF10B981) else Color(0xFFEF4444)
            )
        }
    }
}

// MARK: - AI Scanner Screen
@Composable
fun AIScannerScreen(viewModel: AppViewModel) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        // Header
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Icon(
                imageVector = Icons.Default.CameraAlt,
                contentDescription = "Scanner IA",
                modifier = Modifier.size(60.dp),
                tint = Color(0xFF10B981)
            )
            
            Text(
                text = "Scanner IA",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F2937)
            )
            
            Text(
                text = "Identifique resíduos com inteligência artificial",
                fontSize = 14.sp,
                color = Color.Gray,
                textAlign = TextAlign.Center
            )
        }
        
        // Instruções
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = Color(0xFFF9FAFB)
            )
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                InstructionRow(
                    number = "1",
                    text = "Aponte a câmera para o resíduo"
                )
                
                InstructionRow(
                    number = "2",
                    text = "Aguarde a identificação automática"
                )
                
                InstructionRow(
                    number = "3",
                    text = "Receba pontos e dicas de descarte"
                )
            }
        }
        
        Spacer(modifier = Modifier.weight(1f))
        
        // Botão de escaneamento
        Button(
            onClick = { /* Iniciar scanner */ },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color(0xFF10B981)
            ),
            shape = RoundedCornerShape(12.dp)
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.CameraAlt,
                    contentDescription = "Câmera"
                )
                
                Text(
                    text = "Iniciar Scanner",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
        
        // Histórico de escaneamentos
        Column {
            Text(
                text = "Escaneamentos Recentes",
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF1F2937),
                modifier = Modifier.padding(bottom = 8.dp)
            )
            
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                item {
                    ScanHistoryCard(
                        item = "Garrafa PET",
                        category = "Plástico",
                        points = 15,
                        date = "Hoje"
                    )
                }
                
                item {
                    ScanHistoryCard(
                        item = "Lata de Alumínio",
                        category = "Metal",
                        points = 20,
                        date = "Ontem"
                    )
                }
                
                item {
                    ScanHistoryCard(
                        item = "Papel Jornal",
                        category = "Papel",
                        points = 10,
                        date = "2 dias"
                    )
                }
            }
        }
        
        Spacer(modifier = Modifier.weight(1f))
    }
}

@Composable
fun InstructionRow(number: String, text: String) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Box(
            modifier = Modifier
                .size(24.dp)
                .background(
                    Color(0xFF10B981),
                    CircleShape
                ),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = number,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
        }
        
        Text(
            text = text,
            fontSize = 14.sp,
            color = Color(0xFF1F2937)
        )
    }
}

@Composable
fun ScanHistoryCard(
    item: String,
    category: String,
    points: Int,
    date: String
) {
    Card(
        modifier = Modifier
            .width(120.dp)
            .height(100.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFFF9FAFB)
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(8.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(
                    text = item,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFF1F2937)
                )
                
                Text(
                    text = category,
                    fontSize = 10.sp,
                    color = Color.Gray
                )
            }
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "+$points pts",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF10B981)
                )
                
                Text(
                    text = date,
                    fontSize = 10.sp,
                    color = Color.Gray
                )
            }
        }
    }
}

// MARK: - Placeholder Screens
@Composable
fun BlockchainScreen(viewModel: AppViewModel) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "Blockchain Screen\nEm desenvolvimento",
            textAlign = TextAlign.Center,
            fontSize = 16.sp,
            color = Color.Gray
        )
    }
}

@Composable
fun SocialScreen(viewModel: AppViewModel) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "Social Screen\nEm desenvolvimento",
            textAlign = TextAlign.Center,
            fontSize = 16.sp,
            color = Color.Gray
        )
    }
}

@Composable
fun MarketplaceScreen(viewModel: AppViewModel) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "Marketplace Screen\nEm desenvolvimento",
            textAlign = TextAlign.Center,
            fontSize = 16.sp,
            color = Color.Gray
        )
    }
}

// MARK: - Data Models and ViewModel
data class BottomNavItem(
    val route: String,
    val title: String,
    val icon: ImageVector
)

data class AppUiState(
    val ecoPoints: Int = 1250,
    val recycledItems: Int = 47,
    val co2Saved: Double = 23.5,
    val globalRank: Int = 342,
    val isLoading: Boolean = false,
    val error: String? = null
)

class AppViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(AppUiState())
    val uiState: StateFlow<AppUiState> = _uiState.asStateFlow()
    
    fun updateEcoPoints(points: Int) {
        _uiState.value = _uiState.value.copy(
            ecoPoints = _uiState.value.ecoPoints + points
        )
    }
    
    fun addRecycledItem() {
        _uiState.value = _uiState.value.copy(
            recycledItems = _uiState.value.recycledItems + 1
        )
    }
    
    fun updateCO2Saved(amount: Double) {
        _uiState.value = _uiState.value.copy(
            co2Saved = _uiState.value.co2Saved + amount
        )
    }
}
