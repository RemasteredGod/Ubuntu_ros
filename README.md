# Ubuntu Focal 20.04 & ROS Noetic Docker Images

This repository provides Docker images for Ubuntu 20.04 (Focal Fossa) and ROS Noetic development environments.

## Available Images

### 1. Ubuntu Focal Base Image
- **Image**: `ghcr.io/remasteredgod/ubuntu-focal:20.04`
- **Description**: Clean Ubuntu 20.04 base image built from scratch
- **Size**: Minimal (~70MB compressed)

### 2. ROS Noetic Image  
- **Image**: `ghcr.io/remasteredgod/ros-noetic:20.04`
- **Description**: Ubuntu 20.04 + ROS Noetic Base installation
- **Size**: ~1.2GB compressed
- **Includes**: ROS Noetic Base, build tools, development utilities

## Quick Start

### Option 1: Ubuntu Base Only
```bash
# Pull the image
docker pull ghcr.io/remasteredgod/ubuntu-focal:20.04

# Run interactive container
docker run -it --rm ghcr.io/remasteredgod/ubuntu-focal:20.04
```

### Option 2: ROS Noetic Environment
```bash
# Pull the image
docker pull ghcr.io/remasteredgod/ros-noetic:20.04

# Run interactive container
docker run -it --rm ghcr.io/remasteredgod/ros-noetic:20.04

# Inside container - ROS is already sourced
roscore  # Start ROS master
```

## Building from Source

### Prerequisites
- Docker Desktop with buildx enabled
- GitHub Container Registry access (for pushing)

### Build Ubuntu Base
```bash
# Build the base Ubuntu image
docker build -t ghcr.io/remasteredgod/ubuntu-focal:20.04 .
```

### Build ROS Noetic
```bash
# Build ROS image (multi-platform)
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --build-arg BASE_IMAGE=ghcr.io/remasteredgod/ubuntu-focal:20.04 \
  -t ghcr.io/remasteredgod/ros-noetic:20.04 \
  -f Dockerfile.ros \
  --push .
```

## Image Details

### Ubuntu Base Features
- Built from scratch using Ubuntu Cloud Image
- Non-interactive installation support
- UTF-8 locale configured
- Essential build tools included

### ROS Noetic Features
- ROS Noetic Base installation
- Auto-sourced ROS environment
- Development tools (git, build-essential, etc.)
- Optimized mirror sources for reliable builds
- Multi-architecture support (amd64, arm64)

## Usage Examples

### Development Environment
```bash
# Mount your workspace
docker run -it --rm \
  -v $(pwd)/workspace:/workspace \
  -w /workspace \
  ghcr.io/remasteredgod/ros-noetic:20.04
```

### CI/CD Pipeline
```yaml
# GitHub Actions example
jobs:
  test:
    runs-on: ubuntu-latest
    container: ghcr.io/remasteredgod/ros-noetic:20.04
    steps:
      - uses: actions/checkout@v3
      - run: |
          source /opt/ros/noetic/setup.bash
          catkin_make
          rostest your_package test.launch
```

### Docker Compose
```yaml
version: '3.8'
services:
  ros-master:
    image: ghcr.io/remasteredgod/ros-noetic:20.04
    command: roscore
    ports:
      - "11311:11311"
  
  ros-node:
    image: ghcr.io/remasteredgod/ros-noetic:20.04
    depends_on:
      - ros-master
    environment:
      - ROS_MASTER_URI=http://ros-master:11311
    volumes:
      - ./src:/catkin_ws/src
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DEBIAN_FRONTEND` | `noninteractive` | Prevents interactive prompts |
| `TZ` | `UTC` | System timezone |
| `LANG` | `en_US.UTF-8` | System locale |

## Troubleshooting

### Build Issues
- **Mirror problems**: The Dockerfile uses kernel.org mirrors for reliability
- **Interactive prompts**: All installations are non-interactive
- **Platform issues**: Use `--platform` flag for specific architectures

### Runtime Issues
- **ROS not found**: Ensure you're using the ROS image, not the base Ubuntu image
- **Permission issues**: Use `--user $(id -u):$(id -g)` for file permissions
- **Network issues**: Check if ports 11311 (ROS Master) are accessible

## Contributing

1. Fork the repository
2. Create a feature branch
3. Test your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Full documentation available at [your-docs-site.com]

## Tags and Versions

- `latest` - Latest stable build
- `20.04` - Ubuntu 20.04 Focal Fossa
- `noetic` - ROS Noetic Ninjemys

---

**Note**: These images are optimized for development and CI/CD workflows. For production use, consider security hardening and minimal package installations.
