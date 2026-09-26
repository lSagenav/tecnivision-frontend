import { test } from "node:test";
import assert from "node:assert/strict";
import { getCloudinaryImageUrl } from "../lib/cloudinary-image";

const original = "https://res.cloudinary.com/store/image/upload/v123/tecnivision/productos/cable.webp";
test("genera los tres tamaños conservando version, carpeta y archivo originales", () => {
  for (const width of [120, 500, 1200]) {
    assert.equal(getCloudinaryImageUrl(original, width), original.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${width}/`));
  }
});
test("conserva URLs ajenas, relativas, invalidas y otros tipos de recursos", () => {
  for (const url of ["", "/img/producto.png", "data:image/png;base64,test", "no es url", "https://example.com/image/upload/cable.jpg", "https://res.cloudinary.com.example.org/store/image/upload/cable.jpg", "https://res.cloudinary.com/store/video/upload/cable.mp4", "https://res.cloudinary.com/store/image/authenticated/cable.jpg"]) {
    assert.equal(getCloudinaryImageUrl(url, 500), url);
  }
});
test("conserva URLs firmadas y anchos invalidos", () => {
  const signed = original.replace("/upload/", "/upload/s--signature--/");
  assert.equal(getCloudinaryImageUrl(signed, 500), signed);
  assert.equal(getCloudinaryImageUrl(original + "?__cld_token__=token", 500), original + "?__cld_token__=token");
  for (const width of [0, -1, 1.5, NaN, Infinity]) assert.equal(getCloudinaryImageUrl(original, width), original);
});
test("preserva parametros, fragmentos y nombres codificados, sin apilar sus transformaciones", () => {
  const url = "https://res.cloudinary.com/store/image/upload/folder/cable%20HDMI.webp?test=1#preview";
  const optimized = getCloudinaryImageUrl(url, 500);
  assert.equal(optimized, url.replace("/upload/", "/upload/f_auto,q_auto,c_limit,w_500/"));
  assert.equal(getCloudinaryImageUrl(optimized, 500), optimized);
  assert.equal(getCloudinaryImageUrl(optimized, 120), getCloudinaryImageUrl(url, 120));
});
