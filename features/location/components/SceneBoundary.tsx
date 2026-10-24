"use client";

import { Component, type ReactNode } from "react";

interface SceneBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

/** Shows `fallback` instead of the 3D map when WebGL is unavailable or the scene throws. */
export default class SceneBoundary extends Component<SceneBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
