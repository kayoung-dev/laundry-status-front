import { Color, MeshBasicMaterial } from "three";

export interface FacePalette {
  top: string;
  left: string;
  right: string;
}

/**
 * Unlit material that colors each face like the design instead of using
 * lights or shadows: upward faces get `top`, walls facing screen-left get
 * `left` and walls facing screen-right get `right`. Sides are picked in view
 * space, so the colors stay right after a quarter turn.
 */
export function createPaletteMaterial(palette: FacePalette, opacity = 1): MeshBasicMaterial {
  const material = new MeshBasicMaterial({
    transparent: opacity < 1,
    opacity,
    depthWrite: opacity >= 1,
    // Pushed back a little so outlines drawn on the edges never flicker through.
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  const uniforms = {
    uTop: { value: new Color(palette.top) },
    uLeft: { value: new Color(palette.left) },
    uRight: { value: new Color(palette.right) },
  };
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vTop;\nvarying float vRight;")
      .replace(
        "#include <begin_vertex>",
        [
          "#include <begin_vertex>",
          "vec3 faceNormal = normal;",
          "#ifdef USE_INSTANCING",
          "faceNormal = mat3( instanceMatrix ) * faceNormal;",
          "#endif",
          "vTop = step( 0.5, normalize( faceNormal ).y );",
          "vRight = step( 0.0, ( modelViewMatrix * vec4( faceNormal, 0.0 ) ).x );",
        ].join("\n"),
      );
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform vec3 uTop;\nuniform vec3 uLeft;\nuniform vec3 uRight;\nvarying float vTop;\nvarying float vRight;")
      .replace("vec4 diffuseColor = vec4( diffuse, opacity );", "vec4 diffuseColor = vec4( mix( mix( uLeft, uRight, vRight ), uTop, vTop ), opacity );");
  };
  material.customProgramCacheKey = () => "washon-palette";
  return material;
}
