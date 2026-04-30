# Relation Graph Packages Source Structure Overview

## Overall Summary

The project's main source code is concentrated under the `packages` directory. It is easiest to understand it as two layers:

1. `packages/relation-graph-models`
   This is the shared core layer of the entire relation-graph project. It is responsible for core capabilities such as graph data, runtime state, layout algorithms, event handling, public APIs, and utility methods.
2. `packages/platforms`
   This is the adaptation layer for different frontend platforms. It provides component implementations, platform hooks, and package entry points for React, Vue 2, Vue 3, and Svelte.

Based on the repository's current directory structure, the platform list is:

- `react`
- `vue2`
- `vue3`
- `svelte`

In other words, the cross-platform target here should be understood as `react/vue2/vue3/svelte`.

## Directory Overview

```text
packages/
├── relation-graph-models/
├── platforms/
│   ├── react/
│   ├── svelte/
│   ├── vue2/
│   └── vue3/
└── styles/
```

The `relation-graph-models` directory carries the real core business logic. The `platforms` directory exposes component packages for different frameworks. The `styles` directory contains the related style assets.

## packages/relation-graph-models

### Positioning

`packages/relation-graph-models` is the core code directory of relation-graph. It mainly contains the graph models and business logic shared by all platforms. The code in this directory determines how the graph is stored, how it is calculated, how it responds to interactions, and how capabilities are exposed.

### Main Responsibilities

- Data management
- State management
- Layout and algorithm management
- Event handling
- Public API organization
- Common utility classes
- Composition and extension of the core graph model

### Main Subdirectories

#### `data/`

This directory is responsible for graph data definitions, data reads and writes, node and line data processing, option handling, and related work. It is the core area of the graph data layer.

In addition to common data logic, this directory also contains:

- `RGDataProvider4React.ts`
- `RGDataProvider4Vue2.ts`
- `RGDataProvider4Vue3.ts`
- `RGDataProvider4Svelte.ts`

These files show that although `relation-graph-models` is positioned as a shared core layer overall, it also contains a small amount of data integration compatibility logic related to the reactive update mechanisms of different platforms.

#### `layouts/`

This directory is responsible for graph layout algorithms and layout analysis capabilities, such as:

- Tree layout
- Force-directed layout
- Circular layout
- Center layout
- Fixed layout
- Folder-style layout
- Network analyzer

This part determines how nodes are arranged, how structural relationships are calculated, and how the final visual layout is formed.

#### `models/`

This directory is responsible for the layered composition of the core relation-graph models. It is one of the most important areas for behavioral implementation in the project. The directory contains multiple model files split by capability, such as:

- View capabilities
- Data capabilities
- Option capabilities
- Line capabilities
- Zoom capabilities
- Effect capabilities
- Event capabilities
- Layout capabilities
- Editing capabilities
- API capabilities

These capabilities are eventually composed into the complete `RelationGraphCore` and higher-level objects.

#### `utils/`

This directory provides common utility capabilities, such as:

- Drag-related utilities
- Math calculation utilities
- Fullscreen utilities
- Graph path generation
- Line path processing
- Graph analysis helper methods

It is the supporting utility collection for the core layer.

### How to Understand This Directory

`packages/relation-graph-models` can be understood as the "engine layer" or "kernel layer" of relation-graph:

- It is not directly equivalent to a frontend framework component.
- It focuses on the data structures and behavior rules of the graph itself.
- It provides unified core capabilities for the upper-level platform components.

## packages/platforms

### Positioning

`packages/platforms` is the platform adaptation layer. Each subdirectory corresponds to a frontend platform component package and also serves as the build entry point for that platform package.

It currently contains:

- `packages/platforms/react`
- `packages/platforms/vue2`
- `packages/platforms/vue3`
- `packages/platforms/svelte`

### Main Responsibilities

Each platform subpackage is mainly responsible for:

- Providing a directly usable `RelationGraph` component for that platform
- Organizing platform-specific UI components such as nodes, lines, toolbars, and editors
- Providing platform-specific hooks, stores, providers, contexts, or similar integration mechanisms
- Importing core models, layouts, and utilities from `relation-graph-models`, then re-exporting them
- Serving as the source entry point and bundle entry point for the platform's npm component package

### Structural Characteristics Visible in the Actual Code

Each platform directory usually contains:

- `src/index.ts`
  The unified export entry point for the platform package.
- Platform-specific component implementation directories
  For example, Vue `.vue` components, React `.tsx` components, and Svelte `.svelte` components.
- Hooks or store-related directories
  These connect the core capabilities to the reactive system of the corresponding framework.
- `package.json`
  The build and publish entry point for that platform package.

### How to Understand This Directory

`packages/platforms` can be understood as the "shell layer" or "framework integration layer":

- Core capabilities are not invented here.
- This layer translates the core capabilities into components and APIs usable by different frontend frameworks.
- The same graph engine is exposed to different technology stacks through different platform subpackages.

## Relationship Between relation-graph-models and platforms

The relationship between the two can be summarized as:

- `relation-graph-models` is responsible for "how the graph works".
- `platforms` is responsible for "how the graph is used in different frameworks".

It can also be understood as:

- The core layer is responsible for rules, state, algorithms, events, and APIs.
- The platform layer is responsible for component wrapping, framework adaptation, export entry points, and build/publish workflows.

Therefore, when reading the source code, it is best to understand `relation-graph-models` first, then look at how each platform wraps it.

## Recommended Reading Order

If you continue analyzing the source code later, the recommended reading order is:

1. `packages/relation-graph-models/models`
   First understand how the core objects are composed by capability layers.
2. `packages/relation-graph-models/data`
   Then understand graph data, state, and the data provider mechanism.
3. `packages/relation-graph-models/layouts`
   Next understand layouts and algorithms.
4. `packages/relation-graph-models/utils`
   Finally fill in the supporting core utility capabilities.
5. `packages/platforms/*/src/index.ts`
   Then review how each platform wraps the core layer into the final component package.

## Summary in One Sentence

The source organization of this project is clear: `packages/relation-graph-models` provides the shared core engine, while `packages/platforms` provides component adaptation and build entry points for different frontend platforms. Together, they form the complete source structure of relation-graph.
