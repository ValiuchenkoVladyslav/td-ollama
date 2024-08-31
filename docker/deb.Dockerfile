FROM debian:bookworm-slim

RUN apt-get update
RUN apt-get install -y curl

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --default-toolchain nightly -y

# Install bun
RUN apt-get install -y unzip
RUN curl -fsSL https://bun.sh/install | bash

# Install Tauri prerequisites
RUN apt-get install -y \
  libwebkit2gtk-4.1-dev \
  build-essential \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh
