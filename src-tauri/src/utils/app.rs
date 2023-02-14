use crate::prisma_main_client::PrismaClient;

pub struct AppState {
  pub prisma_client: PrismaClient,
}
