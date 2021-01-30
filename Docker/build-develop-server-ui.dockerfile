FROM node:15 AS build

ARG VERSION
RUN test -n "${VERSION}" || (echo "VERSION argument not provided" && false)

WORKDIR /src
COPY . ./

RUN npm version ${VERSION} --no-git-tag-version
RUN npm install
RUN npm run build
RUN find ./src -type f -name "*.ts" -delete && find ./src -type d -empty -delete

FROM scratch

WORKDIR /dist
COPY --from=build /src ./