<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>กำลังโหลดเกม...</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <header class="topbar">
    <a href="index.html" class="back">← กลับ</a>
    <h1 id="title">กำลังโหลด...</h1>
    <button id="fs">⛶ เต็มจอ</button>
  </header>
  <main class="player">
    <iframe id="frame" allow="fullscreen; autoplay; gamepad" allowfullscreen></iframe>
    <section class="meta">
      <p id="dev"></p>
      <p id="desc"></p>
    </section>
  </main>
  <script type="module" src="js/play.js"></script>
</body>
</html>
