// import { interpolateNumber, interpolateRound } from "d3-interpolate";

export function constant(x) {
  return function () {
    return x;
  };
}

export function number(x) {
  return +x;
}

export function interpolateNumber(a, b) {
  return (
    (a = +a),
    (b = +b),
    function (t) {
      return a * (1 - t) + b * t;
    }
  );
}

const unit = [0, 1];

export function identity(x) {
  return x;
}

function normalize(a, b) {
  return (b -= a = +a)
    ? function (x) {
        return (x - a) / b;
      }
    : constant(isNaN(b) ? NaN : 0.5);
}

function bimap(domain, range, interpolate) {
  let d0 = domain[0],
    d1 = domain[1],
    r0 = range[0],
    r1 = range[1];
  if (d1 < d0) (d0 = normalize(d1, d0)), (r0 = interpolate(r1, r0));
  else (d0 = normalize(d0, d1)), (r0 = interpolate(r0, r1));
  return function (x) {
    return r0(d0(x));
  };
}

function polymap(domain, range, interpolate) {
  let j = Math.min(domain.length, range.length) - 1,
    d = new Array(j),
    r = new Array(j),
    i = -1;

  // Reverse descending domains.
  if (domain[j] < domain[0]) {
    domain = domain.slice().reverse();
    range = range.slice().reverse();
  }

  while (++i < j) {
    d[i] = normalize(domain[i], domain[i + 1]);
    r[i] = interpolate(range[i], range[i + 1]);
  }

  // return function (x) {
  //   const i = bisect(domain, x, 1, j) - 1;
  //   return r[i](d[i](x));
  // };
}

export function copy(source, target) {
  return target
    .domain(source.domain())
    .range(source.range())
    .interpolate(source.interpolate())
    .clamp(source.clamp())
    .unknown(source.unknown());
}
function clamper(a, b) {
  let t;
  if (a > b) (t = a), (a = b), (b = t);
  return function (x) {
    return Math.max(a, Math.min(b, x));
  };
}

export function transformer() {
  let domain = unit,
    range = unit,
    interpolate = interpolateNumber,
    transform,
    untransform,
    unknown,
    clamp = identity,
    piecewise,
    output,
    input;

  function rescale() {
    const n = Math.min(domain.length, range.length);
    if (clamp !== identity) clamp = clamper(domain[0], domain[n - 1]);
    piecewise = n > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }

  function scale(x) {
    return x == null || isNaN((x = +x))
      ? unknown
      : (
          output ||
          (output = piecewise(domain.map(transform), range, interpolate))
        )(transform(clamp(x)));
  }

  scale.invert = function (y) {
    return clamp(
      untransform(
        (
          input ||
          (input = piecewise(range, domain.map(transform), interpolateNumber))
        )(y)
      )
    );
  };

  scale.domain = function (_) {
    return arguments.length
      ? ((domain = Array.from(_, number)), rescale())
      : domain.slice();
  };

  scale.range = function (_) {
    return arguments.length
      ? ((range = Array.from(_)), rescale())
      : range.slice();
  };

  // scale.rangeRound = function (_) {
  //   return (range = Array.from(_)), (interpolate = interpolateRound), rescale();
  // };

  // scale.clamp = function (_) {
  //   return arguments.length
  //     ? ((clamp = _ ? true : identity), rescale())
  //     : clamp !== identity;
  // };

  scale.interpolate = function (_) {
    return arguments.length ? ((interpolate = _), rescale()) : interpolate;
  };

  scale.unknown = function (_) {
    return arguments.length ? ((unknown = _), scale) : unknown;
  };

  return function (t, u) {
    (transform = t), (untransform = u);
    return rescale();
  };
}

export function continuous() {
  return transformer()(identity, identity);
}

const e10 = Math.sqrt(50),
  e5 = Math.sqrt(10),
  e2 = Math.sqrt(2);

export function ticks(start, stop, count) {
  let reverse,
    i = -1,
    n,
    ticks,
    step;

  (stop = +stop), (start = +start), (count = +count);
  if (start === stop && count > 0) return [start];
  if ((reverse = stop < start)) (n = start), (start = stop), (stop = n);
  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step))
    return [];

  if (step > 0) {
    let r0 = Math.round(start / step),
      r1 = Math.round(stop / step);
    if (r0 * step < start) ++r0;
    if (r1 * step > stop) --r1;
    ticks = new Array((n = r1 - r0 + 1));
    while (++i < n) ticks[i] = (r0 + i) * step;
  } else {
    step = -step;
    let r0 = Math.round(start * step),
      r1 = Math.round(stop * step);
    if (r0 / step < start) ++r0;
    if (r1 / step > stop) --r1;
    ticks = new Array((n = r1 - r0 + 1));
    while (++i < n) ticks[i] = (r0 + i) / step;
  }

  if (reverse) ticks.reverse();

  return ticks;
}

export function tickIncrement(start, stop, count) {
  const step = (stop - start) / Math.max(0, count),
    power = Math.floor(Math.log(step) / Math.LN10),
    error = step / Math.pow(10, power);
  return power >= 0
    ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) *
        Math.pow(10, power)
    : -Math.pow(10, -power) /
        (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}

export function tickStep(start, stop, count) {
  let step0 = Math.abs(stop - start) / Math.max(0, count),
    step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
    error = step0 / step1;
  if (error >= e10) step1 *= 10;
  else if (error >= e5) step1 *= 5;
  else if (error >= e2) step1 *= 2;
  return stop < start ? -step1 : step1;
}

export function initRange(domain, range) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(domain);
      break;
    default:
      this.range(range).domain(domain);
      break;
  }
  return this;
}

export function initInterpolator(domain, interpolator) {
  switch (arguments.length) {
    case 0:
      break;
    case 1: {
      if (typeof domain === "function") this.interpolator(domain);
      else this.range(domain);
      break;
    }
    default: {
      this.domain(domain);
      if (typeof interpolator === "function") this.interpolator(interpolator);
      else this.range(interpolator);
      break;
    }
  }
  return this;
}

function linearish(scale) {
  const domain = scale.domain;

  scale.ticks = function (count) {
    const d = domain();
    return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
  };

  // scale.tickFormat = function (count, specifier) {
  //   const d = domain();
  //   return tickFormat(
  //     d[0],
  //     d[d.length - 1],
  //     count == null ? 10 : count,
  //     specifier
  //   );
  // };

  scale.nice = function (count) {
    if (count == null) count = 10;

    const d = domain();
    let i0 = 0;
    let i1 = d.length - 1;
    let start = d[i0];
    let stop = d[i1];
    let prestep;
    let step;
    let maxIter = 10;

    if (stop < start) {
      (step = start), (start = stop), (stop = step);
      (step = i0), (i0 = i1), (i1 = step);
    }

    while (maxIter-- > 0) {
      step = tickIncrement(start, stop, count);
      if (step === prestep) {
        d[i0] = start;
        d[i1] = stop;
        return domain(d);
      } else if (step > 0) {
        start = Math.floor(start / step) * step;
        stop = Math.ceil(stop / step) * step;
      } else if (step < 0) {
        start = Math.ceil(start * step) / step;
        stop = Math.floor(stop * step) / step;
      } else {
        break;
      }
      prestep = step;
    }

    return scale;
  };

  return scale;
}

export function linear() {
  const scale = continuous();

  // scale.copy = function () {
  //   return copy(scale, linear());
  // };

  initRange.apply(scale, arguments);

  return linearish(scale);
}
