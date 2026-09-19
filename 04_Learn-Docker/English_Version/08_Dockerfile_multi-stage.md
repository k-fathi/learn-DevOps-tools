# Docker Multi-Stage Builds 

Multi-stage builds separate build-time concerns from runtime artifacts to produce smaller, safer production images. Use multiple `FROM` stages, name stages with `AS`, and copy only required artifacts with `COPY --from=`.

---

## Why — Core Problems & Security Risks

- **Large images**: Including compilers, build tools, and full source trees in runtime images inflates image size (often gigabytes).
- **Security risk**: Shipping build tools and source code in production increases attack surface and may leak sensitive information.

> Best practice: perform compilation and dependency installation in dedicated build stages, then copy only runtime artifacts into a minimal final stage.

---

## What — Architecture & Concept

Analogy: **Kitchen (build stage)** vs **Dining room (runtime stage)**. Prepare everything in the kitchen; only serve the finished dish in the dining room.

Key concepts:
- Each `FROM` starts an isolated build stage with its own base image and filesystem.
- Use `AS <name>` to name stages for clarity.
- Use `COPY --from=<stage>` to transfer only necessary artifacts into the final stage.
- Final image contains only what is explicitly copied into the last stage.

---

## How — Syntax, Patterns, and Examples

### Basic pattern (named stages)
```dockerfile
FROM golang:1.25 AS builder
WORKDIR /src
COPY . .
RUN go build -o /bin/app .

FROM scratch AS runtime
COPY --from=builder /bin/app /bin/app
CMD ["/bin/app"]
```

### Copying from a numbered stage
```dockerfile
# builder is stage 0
FROM golang:1.25
# ...
FROM scratch
COPY --from=0 /bin/app /bin/app
```

### Using heredoc to inject files during build
```dockerfile
FROM golang:1.25 AS build
WORKDIR /src
COPY <<EOF /src/main.go
package main
import "fmt"
func main() { fmt.Println("hello, world") }
EOF
RUN go build -o /bin/hello ./main.go

FROM scratch
COPY --from=build /bin/hello /bin/hello
CMD ["/bin/hello"]
```

### COPY from external image
```dockerfile
COPY --from=nginx:latest /etc/nginx/nginx.conf /nginx.conf
```

### Reusing a previous stage as a base for multiple sub-builds
```dockerfile
# syntax=docker/dockerfile:1
FROM alpine:latest AS builder
RUN apk --no-cache add build-base

FROM builder AS build1
COPY source1.cpp source.cpp
RUN g++ -o /binary1 source.cpp

FROM builder AS build2
COPY source2.cpp source.cpp
RUN g++ -o /binary2 source.cpp
```

---

## Compiled vs Interpreted Languages, Static Linking & Base Image Selection

- **Compiled languages (Go, C/C++, Java)**: build in a full SDK image; copy the produced binary into a minimal base.
- **Interpreted languages (Python, Node.js, Ruby)**: install dependencies in a build stage; copy only installed packages + app code into a slimmer runtime image.

Comparison table:

| Concern | Compiled (Go/C++) | Interpreted (Python/Node) |
|---|---:|---|
| Build tools required | Yes (compiler/SDK) | Package installers (pip/npm) |
| Final image can be | scratch (if statically linked) | slim/alpine (runtime/interpreter required) |
| Best practice | Copy single binary | Copy site-packages/node_modules + app files |

Notes:
- **Statically linked binaries** (common with Go) enable using **scratch** as the final base (zero overhead).
- Use **alpine** or **-slim** when the interpreter or libc is required or you need shell tools for debugging.

Example: Python multi-stage
```dockerfile
FROM python:3.11 AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt --target=/install

FROM python:3.11-slim
COPY --from=builder /install /usr/local/lib/python3.11/site-packages
COPY app.py .
CMD ["python", "app.py"]
```

---

## Controlling the Build Path — `--target`

- Build up to a specific stage using `--target <stage>`:
```console
$ docker build --target builder -t myapp:builder .
```
Use cases:
- Debugging builder stage
- Producing intermediate artifacts for testing
- Building environment-specific stages (dev/test/prod)

---

## BuildKit vs Legacy Builder (Behavioral Differences)

- **BuildKit (modern)**:
  - Builds only stages required by the target.
  - Supports parallel stage execution and improved caching.
  - Enable: `DOCKER_BUILDKIT=1 docker build .`

- **Legacy builder**:
  - Processes all stages up to the selected `--target`, even if unrelated.
  - Can produce unnecessary work.

Example Dockerfile:
```dockerfile
# syntax=docker/dockerfile:1
FROM ubuntu AS base
RUN echo "base"

FROM base AS stage1
RUN echo "stage1"

FROM base AS stage2
RUN echo "stage2"
```

Build outputs:
- With BuildKit:
```console
$ DOCKER_BUILDKIT=1 docker build --no-cache -f Dockerfile --target stage2 .
# Only base and stage2 are processed
```
- Without BuildKit (legacy):
```console
$ DOCKER_BUILDKIT=0 docker build --no-cache -f Dockerfile --target stage2 .
# base, stage1 and stage2 are processed
```

> Recommendation: enable BuildKit for faster, more efficient multi-stage builds.

---

## Best Practices & Tips

- Name stages with `AS <name>` for readability and resilience to reordering.
- Copy only the files required by the runtime stage (binaries, compiled assets, installed packages).
- Use `--target` to isolate stage builds for debugging or CI steps.
- Prefer statically linked artifacts and `scratch` when feasible to minimize image surface.
- For interpreted runtimes, preinstall dependencies in a builder stage and copy installed packages into a slimmer runtime image.
- Use `COPY --from=<image>` to import artifacts from external images or local image tags.

---

## Reference Commands

- Build full production image:
```console
$ docker build -t myapp:latest .
```
- Build a specific target:
```console
$ docker build --target test -t myapp:test .
```
- Enable BuildKit:
```console
$ DOCKER_BUILDKIT=1 docker build .
```

---

## Appendix — Minimal Example (Go)
```dockerfile
FROM golang:1.25 AS build
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o /bin/app .

FROM scratch
COPY --from=build /bin/app /bin/app
CMD ["/bin/app"]
```
```console
$ DOCKER_BUILDKIT=1 docker build -t hello:latest .
```