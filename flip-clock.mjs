// Eva's approved upper/lower wood-and-PNG flip, without the sample's review controls.
export class WoodenFlipClock {
  constructor(host, sources, units) {
    this.sources = sources;
    this.tiles = [];
    this.transitions = new Map();
    for (const unit of units) {
      const group = document.createElement('span');
      group.className = 'wooden-pair';
      const slots = document.createElement('span');
      slots.className = 'wooden-pair-tiles';
      for (let i = 0; i < 2; i++) {
        const tile = document.createElement('span');
        tile.className = 'wooden-tile';
        tile.append(this.half('upper', '0'), this.half('lower', '0'));
        slots.append(tile);
        this.tiles.push(tile);
      }
      const label = document.createElement('span');
      label.className = 'wooden-unit';
      label.dataset.t = unit;
      group.append(slots, label);
      host.append(group);
    }
  }

  half(type, digit, extra = '') {
    const half = document.createElement('span');
    half.className = `wooden-half ${type} ${extra}`;
    const image = new Image();
    image.src = this.sources[digit].src;
    image.alt = '';
    image.draggable = false;
    half.append(image);
    return half;
  }

  settleTile(tile) {
    const transition = this.transitions.get(tile);
    if (!transition) return;
    transition.animations.forEach(animation => animation.cancel());
    transition.layers.forEach(layer => layer.remove());
    tile.children[0].firstElementChild.src = this.sources[tile.dataset.value].src;
    tile.children[1].firstElementChild.src = this.sources[tile.dataset.value].src;
    this.transitions.delete(tile);
  }

  settle() {
    for (const tile of [...this.transitions.keys()]) this.settleTile(tile);
  }

  render(digits, {animate = true} = {}) {
    for (const [index, tile] of this.tiles.entries()) {
      const from = tile.dataset.value, to = digits[index];
      if (from === to) continue;
      this.settleTile(tile);
      tile.dataset.value = to;
      const top = tile.children[0], bottom = tile.children[1];
      top.firstElementChild.src = this.sources[to].src;
      bottom.firstElementChild.src = this.sources[from ?? to].src;
      if (!animate || from === undefined || typeof tile.animate !== 'function') {
        bottom.firstElementChild.src = this.sources[to].src;
        continue;
      }
      const old = this.half('upper', from, 'flip-old');
      const fresh = this.half('lower', to, 'flip-new');
      tile.append(old, fresh);
      const a = old.animate([{transform:'rotateX(0deg)'}, {transform:'rotateX(-90deg)'}],
        {duration:220, easing:'ease-in', fill:'forwards'});
      const b = fresh.animate([{transform:'rotateX(90deg)'},
        {transform:'rotateX(90deg)', offset:.49}, {transform:'rotateX(0deg)'}],
        {duration:440, easing:'ease-out'});
      this.transitions.set(tile, {animations:[a,b], layers:[old,fresh]});
      a.onfinish = () => old.remove();
      b.onfinish = () => this.settleTile(tile);
    }
  }
}
