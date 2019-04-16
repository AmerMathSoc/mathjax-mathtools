/*************************************************************
 *  Copyright (c) 2019 American Mathematical Society
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

MathJax.Extension['TeX/mathtools'] = {
  version: '1.0.0'
};

MathJax.Hub.Register.StartupHook('TeX Jax Ready', function() {
  var TEX = MathJax.InputJax.TeX;
  TEX.Definitions.Add({
    macros: {
      coloneqq: ['Macro', '\\mathrel{≔}'],
    },
    environment: {
      'bmatrix*': ['Array', 'bmatrix*', '[', ']'],
      dcases: ['Array', null, '\\{', '.', 'll', null, '.2em', 'D'],
      bsmallmatrix: ['Array', null, '[', ']', 'c', '0.333em', '.2em', 'S', 1],
      multlined: ['Array', null, '[', ']', 'c', '0.333em', '.2em', 'S', 1]
    }
  });
});

MathJax.Hub.Register.StartupHook('TeX AMSmath Ready', function() {
  var MML = MathJax.ElementJax.mml,
    TEX = MathJax.InputJax.TeX,
    TEXDEF = TEX.Definitions,
    STACKITEM = TEX.Stack.Item;

  TEXDEF.Add({
    environment: {
      mathtoolsat: ['mathtoolsAt', null, true, true],
      'mathtoolsat*': ['mathtoolsAt', null, false, true],
      xmathtoolsat: ['mathtoolsAt', null, true, false],
      'xmathtoolsat*': ['mathtoolsAt', null, false, false],
      flalign: [
        'mathtoolsArray',
        null,
        true,
        false,
        true,
        'rlcrlcrlcrlcrlcrlc',
        ['', ' ', ' ', ' ', ' ', ' ', ''].join('auto auto fit')
      ],
      'flalign*': [
        'mathtoolsArray',
        null,
        false,
        false,
        true,
        'rlcrlcrlcrlcrlcrlc',
        ['', ' ', ' ', ' ', ' ', ' ', ''].join('auto auto fit')
      ]
    }
  });

  TEX.Parse.Augment({
    mathtoolsAt: function(begin, numbered, padded) {
      var n,
        align = [],
        width = [];
      n = this.GetArgument('\\begin{' + begin.name + '}');
      if (n.match(/[^0-9]/)) {
        TEX.Error([
          'PositiveIntegerArg',
          'Argument to %1 must me a positive integer',
          '\\begin{' + begin.name + '}'
        ]);
      }
      if (padded) {
        align.push('');
        width.push('');
      }
      while (n > 0) {
        align.push('rl');
        width.push('auto auto');
        n--;
      }
      if (padded) {
        align.push('');
        width.push('');
      }
      return this.mathtoolsArray(
        begin,
        numbered,
        padded,
        false,
        align.join('c'),
        width.join(' fit ')
      );
    },

    mathtoolsArray: function(begin, numbered, padded, center, align, width) {
      this.Push(begin);
      this.checkEqnEnv();
      align = align
        .split('')
        .join(' ')
        .replace(/r/g, 'right')
        .replace(/l/g, 'left')
        .replace(/c/g, 'center');
      return STACKITEM.mathtoolsArray(
        begin.name,
        numbered,
        padded,
        center,
        this.stack
      ).With({
        arraydef: {
          width: '100%',
          displaystyle: true,
          columnalign: align,
          columnspacing: '0em',
          columnwidth: width,
          rowspacing: '3pt',
          side: TEX.config.TagSide,
          minlabelspacing: TEX.config.TagIndent
        }
      });
    }
  });

  STACKITEM.mathtoolsArray = STACKITEM.AMSarray.Subclass({
    type: 'mathtoolsArray',
    Init: function(name, numbered, padded, center, stack) {
      this.SUPER(arguments).Init(name, numbered, padded || center, stack);
      this.padded = padded;
      this.center = center;
      this.maxrow = 0;
    },
    EndRow: function() {
      var cell,
        row = this.row;
      this.row = [];
      if (this.padded) this.row.push(MML.mtd());
      while ((cell = row.shift())) {
        this.row.push(cell);
        cell = row.shift();
        if (cell) this.row.push(cell);
        if (row.length || this.padded) this.row.push(MML.mtd());
      }
      if (this.row.length > this.maxrow) this.maxrow = this.row.length;
      this.SUPER(arguments).EndRow.call(this);
    },
    EndTable: function() {
      this.SUPER(arguments).EndTable.call(this);
      if (this.center) {
        var def = this.arraydef;
        if (this.maxrow <= 2) delete def.width;
        def.columnalign = def.columnalign
          .split(/ /)
          .slice(0, this.maxrow)
          .join(' ');
        def.columnwidth = def.columnwidth
          .split(/ /)
          .slice(0, this.maxrow)
          .join(' ');
      }
    }
  });

  MathJax.Hub.Startup.signal.Post('TeX mathtools Ready');
});

MathJax.Callback.Queue([
  'loadComplete',
  MathJax.Ajax,
  '[mathtools]/mathtools.js'
]);
