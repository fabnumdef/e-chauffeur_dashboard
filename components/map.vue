<template>
  <div id="map-wrap">
    <no-ssr>
      <l-map
        :zoom="13"
        :center="[47.413220, -1.219482]"
      >
        <l-tile-layer url="//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <l-marker :lat-lng="[47.413220, -1.219482]" />
      </l-map>
    </no-ssr>
  </div>
</template>
