import { MeshBasicMaterial, type MeshBasicMaterialParameters } from "three";

/**
 * Unlit material that shades by face instead of using lights or shadows:
 * tops are lifted toward white and walls facing +x are darkened, so one color
 * per block reads like the design's top / left / right faces.
 * Works for geometry whose normals are axis-aligned and not rotated per instance.
 */
export function createFaceShadeMaterial(params?: MeshBasicMaterialParameters): MeshBasicMaterial {
  // Pushed back a little so outlines drawn on the edges never flicker through.
  const material = new MeshBasicMaterial({ polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1, ...params });
  material.onBeforeCompile = (shader) => {
    const varyings = "#include <common>\nvarying float vTop;\nvarying float vSide;";
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", varyings)
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvTop = step(0.5, normal.y);\nvSide = step(0.5, abs(normal.x));");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", varyings)
      .replace(
        "#include <color_fragment>",
        "#include <color_fragment>\ndiffuseColor.rgb = mix(diffuseColor.rgb * mix(1.0, 0.72, vSide), vec3(1.0), vTop * 0.62);",
      );
  };
  material.customProgramCacheKey = () => "washon-face-shade";
  return material;
}
