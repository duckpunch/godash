import assert from 'assert';
import {
  Coordinate,
} from '../src/board';
import {
  compactMoves,
  coordinateToSgfPoint,
  nextToken,
  sgfPointToCoordinate,
  sgfToJS,
  tokenize,
} from './sgf';

describe('coordinateToSgfPoint', function() {
  it('converts (0, 0) to "aa"', function() {
    assert.equal(
      coordinateToSgfPoint(
        new Coordinate(0, 0)
      ), 'aa'
    );
  });
});

describe('sgfPointToCoordinate', function() {
  it('converts "aa" to (0, 0)', function() {
    assert.ok(
      (new Coordinate(0, 0)).equals(
        sgfPointToCoordinate('aa')
      )
    );
  });

  it('converts "hi" to (7, 8)', function() {
    assert.ok(
      (new Coordinate(7, 8)).equals(
        sgfPointToCoordinate('hi')
      )
    );
  });

  it('raises if passed a non-string', function() {
    assert.throws(function() {
      sgfPointToCoordinate(5);
    }, TypeError);
  });

  it('raises if passed string not length 2', function() {
    assert.throws(function() {
      sgfPointToCoordinate('roar');
    }, TypeError);
  });
});

describe('tokenize', function() {
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
    it(testCase.description, function() {
      assert.deepEqual(
        tokenize(testCase.input),
        testCase.expected,
      );
    });
  }
});

describe('compactMoves', function() {
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
    it(testCase.description, function() {
      assert.deepEqual(
        compactMoves(testCase.input),
        testCase.expected,
      );
    });
  }
});

describe('sgfToJS', function() {
  it('can parse a real looking SGF', function() {
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

  it('throws on broken SGF, pt 1', function() {
    const brokenSgf = `(
        ;FF[4]GM[1]SZ[19];B[aa];W[bb]
            (;B[cc];W[dd];B[ad];W[bd])
            (;B[hh];W[hg]C[what a move!])
            (;B[gg];W[gh];B[hh]
                (;W[hg];B[kk])
                (;W[kl])
    )`;
    assert.throws(function() {
      sgfToJS(brokenSgf);
    });
  });

  it('throws on broken SGF, pt 2', function() {
    const brokenSgf = 'ZOMG BROKEN';
    assert.throws(function() {
      sgfToJS(brokenSgf);
    });
  });

  it('throws on broken token', function() {
    const brokenToken = '1';
    assert.throws(function() {
      nextToken(brokenToken);
    });
  });
});
