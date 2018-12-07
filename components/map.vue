<template>
  <div id="map-wrap">
    <NoSsr>
      <LMap
        :zoom="13"
        :center="[47.413220, -1.219482]"
      >
        <LTileLayer url="//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LMarker :lat-lng="[47.413220, -1.219482]" />
      </LMap>
    </NoSsr>
  </div>
</template>
