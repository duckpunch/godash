import assert from 'assert';
import {
  Coordinate,
} from '../src/board';
import {
  chessLikeToCoordinate,
  compactMoves,
  coordinateToChessLike,
  coordinateToSgfPoint,
  nextToken,
  sgfPointToCoordinate,
  sgfToJS,
  tokenize,
} from './sgf';

describe('coordinateToSgfPoint', () => {
  it('converts (0, 0) to "aa"', () => {
    assert.equal(
      coordinateToSgfPoint(
        Coordinate(0, 0)
      ), 'aa'
    );
  });
});

describe('sgfPointToCoordinate', () => {
  it('converts "aa" to (0, 0)', () => {
    assert.ok(
      Coordinate(0, 0).equals(
        sgfPointToCoordinate('aa')
      )
    );
  });

  it('converts "hi" to (7, 8)', () => {
    assert.ok(
      Coordinate(7, 8).equals(
        sgfPointToCoordinate('hi')
      )
    );
  });

  it('raises if passed a non-string', () => {
    assert.throws(() => {
      sgfPointToCoordinate(5);
    }, TypeError);
  });

  it('raises if passed string not length 2', () => {
    assert.throws(() => {
      sgfPointToCoordinate('roar');
    }, TypeError);
  });
});

describe('tokenize', () => {
  const testCases = [
    {
      description: 'does tokenizing',
      input: '()',
      expected: ['(', ')'],
    },
    {
      description: 'does basics',
      input: '(;B[aa])',
      expected: ['(', ';', ['B', 'aa'], ')'],
    },
    {
      description: 'handles escapes',
      input: '(;B[aa]C[\\[\\] hello there])',
      expected: ['(', ';', ['B', 'aa'], ['C', '[] hello there'], ')'],
    },
    {
      description: 'handles escaped backslashes',
      input: '(;B[aa]C[\\[\\] \\\\ hello there])',
      expected: ['(', ';', ['B', 'aa'], ['C', '[] \\ hello there'], ')'],
    },
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    it(testCase.description, () => {
      assert.deepEqual(
        tokenize(testCase.input),
        testCase.expected,
      );
    });
  }
});

describe('compactMoves', () => {
  const testCases = [
    {
      description: 'does nothing to starts and stops',
      input: ['(', ')'],
      expected: ['(', ')'],
    },
    {
      description: 'compacts a simple move',
      input: ['(', ';', ['B', 'aa'], ['W', 'bb'], ')'],
      expected: ['(', {B: 'aa', W: 'bb'}, ')'],
    },
    {
      description: 'handles variations',
      input: [
        '(',
        ';', ['B', 'aa'], ['W', 'bb'],
        ';', ['B', 'cc'],
        ';', ['W', 'dd'],
        '(',
        ';', ['B', 'ee'],
        ')',
        '(',
        ';', ['B', 'ff'],
        ')',
        ')',
      ],
      expected: [
        '(',
        {B: 'aa', W: 'bb'},
        {B: 'cc'},
        {W: 'dd'},
        '(',
        {B: 'ee'},
        ')',
        '(',
        {B: 'ff'},
        ')',
        ')',
      ],
    },
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    it(testCase.description, () => {
      assert.deepEqual(
        compactMoves(testCase.input),
        testCase.expected,
      );
    });
  }
});

describe('sgfToJS', () => {
  it('can parse a real looking SGF', () => {
    const rawSgf = `(
        ;FF[4]GM[1]SZ[19];B[aa];W[bb]
            (;B[cc];W[dd];B[ad];W[bd])
            (;B[hh];W[hg]C[what a move!])
            (;B[gg];W[gh];B[hh]
                (;W[hg];B[kk])
                (;W[kl])
            )
    )`;

    const expected = [
      {FF: '4', GM: '1', SZ: '19'}, {B: 'aa'}, {W: 'bb'},
      [
        [{B: 'cc'}, {W: 'dd'}, {B: 'ad'}, {W: 'bd'}],
        [{B: 'hh'}, {W: 'hg', C: 'what a move!'}],
        [
          {B: 'gg'}, {W: 'gh'}, {B: 'hh'},
          [
            [{W: 'hg'}, {B: 'kk'}],
            [{W: 'kl'}],
          ]
        ]
      ],
    ];

    assert.deepEqual(expected, sgfToJS(rawSgf));
  });

  it('throws on broken SGF, pt 1', () => {
    const brokenSgf = `(
        ;FF[4]GM[1]SZ[19];B[aa];W[bb]
            (;B[cc];W[dd];B[ad];W[bd])
            (;B[hh];W[hg]C[what a move!])
            (;B[gg];W[gh];B[hh]
                (;W[hg];B[kk])
                (;W[kl])
    )`;
    assert.throws(() => {
      sgfToJS(brokenSgf);
    });
  });

  it('throws on broken SGF, pt 2', () => {
    const brokenSgf = 'ZOMG BROKEN';
    assert.throws(() => {
      sgfToJS(brokenSgf);
    });
  });

  it('throws on broken token', () => {
    const brokenToken = '1';
    assert.throws(() => {
      nextToken(brokenToken);
    });
  });
});

describe('chessLikeToCoordinate', () => {
  it('converts valid coordinates', () => {
    assert.ok(Coordinate(0, 0).equals(chessLikeToCoordinate('a1')));
    assert.ok(Coordinate(5, 4).equals(chessLikeToCoordinate('f5')));
    assert.ok(Coordinate(0, 12).equals(chessLikeToCoordinate('A13')));
    assert.ok(Coordinate(25, 9).equals(chessLikeToCoordinate('aa10')));
    assert.ok(Coordinate(28, 19).equals(chessLikeToCoordinate('AD20')));
  });

  it('throws on invalid format', () => {
    assert.throws(() => chessLikeToCoordinate('WTF'));
  });

  it('throws on letter "I"', () => {
    assert.throws(() => chessLikeToCoordinate('I9'));
  });

  it('throws on zero', () => {
    assert.throws(() => chessLikeToCoordinate('A0'));
    assert.throws(() => chessLikeToCoordinate('A00'));
  });
});
