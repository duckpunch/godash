const Benchmark = require('benchmark');

const godash = require('../dist/godash');

const suite = new Benchmark.Suite();
const board = new godash.Board();
const sgf = `
  (;GM[1]FF[4]CA[UTF-8]AP[CGoban:3]ST[2]
  RU[Chinese]SZ[19]KM[7.50]TM[7200]OT[3x60 byo-yomi]
  PW[Lee Sedol]PB[AlphaGo]WR[9p]DT[2016-03-13]RE[W+Resign]
  ;B[pd];W[dp];B[cd];W[qp];B[op];W[oq];B[nq];W[pq];B[cn];W[fq];B[mp]
  ;W[po];B[iq];W[ec];B[hd];W[cg];B[ed];W[cj];B[dc];W[bp];B[nc];W[qi]
  ;B[ep];W[eo];B[dk];W[fp];B[ck];W[dj];B[ej];W[ei];B[fi];W[eh];B[fh]
  ;W[bj];B[fk];W[fg];B[gg];W[ff];B[gf];W[mc];B[md];W[lc];B[nb];W[id]
  ;B[hc];W[jg];B[pj];W[pi];B[oj];W[oi];B[ni];W[nh];B[mh];W[ng];B[mg]
  ;W[mi];B[nj];W[mf];B[li];W[ne];B[nd];W[mj];B[lf];W[mk];B[me];W[nf]
  ;B[lh];W[qj];B[kk];W[ik];B[ji];W[gh];B[hj];W[ge];B[he];W[fd];B[fc]
  ;W[ki];B[jj];W[lj];B[kh];W[jh];B[ml];W[nk];B[ol];W[ok];B[pk];W[pl]
  ;B[qk];W[nl];B[kj];W[ii];B[rk];W[om];B[pg];W[ql];B[cp];W[co];B[oe]
  ;W[rl];B[sk];W[rj];B[hg];W[ij];B[km];W[gi];B[fj];W[jl];B[kl];W[gl]
  ;B[fl];W[gm];B[ch];W[ee];B[eb];W[bg];B[dg];W[eg];B[en];W[fo];B[df]
  ;W[dh];B[im];W[hk];B[bn];W[if];B[gd];W[fe];B[hf];W[ih];B[bh];W[ci]
  ;B[ho];W[go];B[or];W[rg];B[dn];W[cq];B[pr];W[qr];B[rf];W[qg];B[qf]
  ;W[jc];B[gr];W[sf];B[se];W[sg];B[rd];W[bl];B[bk];W[ak];B[cl];W[hn]
  ;B[in];W[hp];B[fr];W[er];B[es];W[ds];B[ah];W[ai];B[kd];W[ie];B[kc]
  ;W[kb];B[gk];W[ib];B[qh];W[rh];B[qs];W[rs];B[oh];W[sl];B[of];W[sj]
  ;B[ni];W[nj];B[oo];W[jp])
`;

const game = godash.sgfToJS(sgf).slice(0);

(
  suite
  .add('addMove', () => {
    // go to move 165
  })
  .on('cycle', event => {
    const benchmark = event.target;

    console.log(benchmark.toString());
  })
  .on('complete', event => {
    const suite = event.currentTarget;
    const fastestOption = suite.filter('fastest').map('name');

    console.log(`The fastest option is ${fastestOption}`);
  })
  .run()
);
