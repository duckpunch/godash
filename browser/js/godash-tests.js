QUnit.module('godash', function() {
  QUnit.test('exists', function(assert) {
    assert.ok(window.godash);
  });
  QUnit.test('has a board', function(assert) {
    assert.ok(window.godash.Board);
  });
  QUnit.test('has a board that can be created', function(assert) {
    assert.ok(new window.godash.Board());
  });
  QUnit.test('has BLACK attribute', function(assert) {
    assert.ok(window.godash.BLACK);
  });
});
