(function () {
  const money = (n) => "$" + n.toFixed(2);

  function initPricing() {
    const bundleRadios = Array.from(document.querySelectorAll('input[name="bundle"]'));
    const qtyInput = document.getElementById("qtyInput");
    const qtyMinus = document.getElementById("qtyMinus");
    const qtyPlus = document.getElementById("qtyPlus");
    const totalPriceEl = document.getElementById("totalPrice");
    const unitPriceEl = document.getElementById("unitPrice");

    if (!bundleRadios.length || !qtyInput || !totalPriceEl || !unitPriceEl) return;

    function getSelected() {
      const r = bundleRadios.find((x) => x.checked) || bundleRadios[0];
      const bottlesPerBundle = Number(r.value);
      const unit = Number(r.dataset.unit);
      return { bottlesPerBundle, unit };
    }

    function getQty() {
      const v = Number(qtyInput.value);
      if (!Number.isFinite(v) || v < 1) return 1;
      return Math.min(10, Math.floor(v));
    }

    function sync() {
      const { bottlesPerBundle, unit } = getSelected();
      const qty = getQty();
      qtyInput.value = qty;

      const bundlePrice = unit * bottlesPerBundle;
      const total = bundlePrice * qty;

      totalPriceEl.textContent = money(total);
      unitPriceEl.textContent = `(${money(unit)} / bottle) • ${bottlesPerBundle} bottle${bottlesPerBundle > 1 ? "s" : ""} per bundle`;
    }

    bundleRadios.forEach((r) => r.addEventListener("change", sync));
    qtyInput.addEventListener("input", sync);

    qtyMinus?.addEventListener("click", () => {
      qtyInput.value = Math.max(1, getQty() - 1);
      sync();
    });

    qtyPlus?.addEventListener("click", () => {
      qtyInput.value = Math.min(10, getQty() + 1);
      sync();
    });

    document.getElementById("addToCart")?.addEventListener("click", () => {
      const { bottlesPerBundle, unit } = getSelected();
      const qty = getQty();
      const bundlePrice = unit * bottlesPerBundle;
      alert(`Added to cart:\n\nBundle: ${bottlesPerBundle} bottle(s)\nBundles: ${qty}\nTotal: ${money(bundlePrice * qty)}`);
    });

    document.getElementById("subscribe")?.addEventListener("click", () => {
      alert("Subscription flow placeholder (connect to your billing/subscription system).");
    });

    sync();
  }

  function initYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initYear();
    initPricing();
  });
})();
