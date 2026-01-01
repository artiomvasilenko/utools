function YandexAds() {
  return (
    <div>
      <script>
        {window.yaContextCb.push(() => {
          Ya.Context.AdvManager.render({
            blockId: "R-A-18331275-1",
            type: "floorAd",
            platform: "desktop",
          });
        })}
      </script>
    </div>
  );
}

export default YandexAds;
