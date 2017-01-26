'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Board = function (_React$Component) {
    _inherits(Board, _React$Component);

    function Board(props) {
        _classCallCheck(this, Board);

        // Monsters & items declaration

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.monsters = [];
        _this.items = [];
        // Options - visible screen size (used by display func)
        _this.options = {
            width: 80,
            height: 30
        };
        // Player constructor
        _this.Entity = function (props) {
            this.char = props.char || '⚇';
            this.fg = props.fg || 'blue';
            this.bg = props.bg || 'white';
            this.x = props.x || 0;
            this.y = props.y || 0;
            // Field of vision
            this.vision = props.vision || 6;
            // Stats - defaults will fit player
            this.hp = props.hp || 100;
            this.lvl = props.lvl || 1;
            this.exp = props.exp || 0;
            this.atk = props.atk || 7;
            this.def = props.def || 3;
            // Player wep & armour
            this.wep = props.wep || 'Fists';
            this.armour = props.armour || 'Cloth Headband';
        };
        // Immediately create instance of player for later use
        _this.Entity.player = new _this.Entity({});

        // Item constructors
        _this.Item = function (props) {
            this.name = "Potion";
            this.type = "potion";
            this.char = '⚕';
            this.fg = 'green';
            this.bg = 'white';
            this.x = 0;
            this.y = 0;
            this.hp = 35;
        };
        _this.Item.weapon = function (props) {
            this.name = props.name || "Oversized Axe";
            this.type = props.type || "weapon";
            this.char = props.char || '⚔';
            this.fg = props.fg || 'gray';
            this.bg = props.bg || 'white';
            this.x = props.x || 0;
            this.y = props.y || 0;
            this.atk = props.atk || 0;
        };
        _this.Item.armour = function (props) {
            this.name = props.name || "Steel Plate";
            this.type = props.type || "armour";
            this.char = props.char || '#';
            this.fg = props.fg || 'gray';
            this.bg = props.bg || 'white';
            this.x = props.x || 0;
            this.y = props.y || 0;
            this.def = props.def || 0;
        };

        // Slime constructor (lvl 1 enemy)
        _this.Entity.slime = function () {
            this.name = "Slime";
            this.char = '©';
            this.fg = 'red';
            this.bg = 'white';
            this.x = 0;
            this.y = 0;
            this.hp = 50;
            this.atk = 7;
            this.yieldExp = props.yieldExp || 50;
        };

        // Succubus constructor (lvl 2 enemy)
        _this.Entity.succubus = function () {
            this.name = "Succubus";
            this.char = '☿';
            this.fg = 'red';
            this.bg = 'white';
            this.x = 0;
            this.y = 0;
            this.hp = 80;
            this.atk = 15;
            this.yieldExp = props.yieldExp || 100;
        };

        // Cacodemon constructor (lvl 3 enemy)
        _this.Entity.cacodemon = function () {
            this.name = "Cacodemon";
            this.char = '☼';
            this.fg = 'red';
            this.bg = 'white';
            this.x = 0;
            this.y = 0;
            this.hp = 115;
            this.atk = 20;
            this.yieldExp = props.yieldExp || 300;
        };

        // Baron constructor (lvl 4 enemy)
        _this.Entity.baron = function () {
            this.name = "Baron of Hell";
            this.char = '♝';
            this.fg = 'red';
            this.bg = 'white';
            this.x = 0;
            this.y = 0;
            this.hp = 175;
            this.atk = 30;
            this.yieldExp = props.yieldExp || 400;
        };

        // Boss constructor
        _this.Entity.boss = function () {
            this.name = "Cyberdemon";
            this.type = "boss";
            this.char = '⚉';
            this.fg = 'red';
            this.bg = 'white';
            this.x = 0;
            this.y = 0;
            this.hp = 200;
            this.atk = 40;
            this.yieldExp = props.yieldExp || 400;
        };
        // Constructor for tiles
        _this.Tile = function (props) {
            this.isWall = props.isWall || false;
            this.char = props.char || ' ';
            this.fg = props.fg || '';
            this.bg = props.bg || 'black';
        };
        // Set up tiles
        _this.Tile.landTile = new _this.Tile({
            char: '',
            bg: 'white'
        });
        _this.Tile.wallTile = new _this.Tile({
            isWall: true,
            char: '',
            bg: 'black'
        });
        // Display screen set up
        _this.display = new ROT.Display({
            width: _this.options.width,
            height: _this.options.height
        });
        // Declare initial state
        _this.state = {
            player: _this.Entity.player,
            level: {
                level: 1,
                name: 'Spooky Dungeon'
            },
            message: "You are exploring"
        };
        return _this;
    }

    Board.prototype.mapSetup = function mapSetup() {
        var _this2 = this;

        var dungeonLevel = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
        var wepAndArmour = arguments[1];

        var w = this.options.width,
            h = this.options.height;
        var map = new ROT.Map.Digger(w, h);
        this.hash = {};
        var mapLayout = [];
        // This will use the 'Digger' algo to set arg 'type' below as 1 for tiles that are land tiles
        map.create(function (x, y, type) {
            _this2.hash[x + "," + y] = type;
            var placeTile = type === 1 ? _this2.Tile.wallTile : _this2.Tile.landTile;
            mapLayout[x] ? mapLayout[x].push(placeTile) : mapLayout.push([placeTile]);
        });

        // Store rooms in rooms var (arr of objs, _x1 _x2, _y1 _y2 defining boundaries)
        var rooms = map.getRooms();
        // Draw the player. Put them in the first room, then shift that out of the rooms arr to keep it empty.
        this.Entity.player.x = ROT.RNG.getUniformInt(rooms[0]['_x1'], rooms[0]['_x2']);
        this.Entity.player.y = ROT.RNG.getUniformInt(rooms[0]['_y1'], rooms[0]['_y2']);
        rooms.shift();
        // Create monsters depending on the current level
        var slime = this.Entity.slime,
            succubus = this.Entity.succubus,
            cacodemon = this.Entity.cacodemon,
            baron = this.Entity.baron,
            boss = this.Entity.boss;
        switch (dungeonLevel) {
            case 1:
                this.monsters = [new slime(), new slime(), new slime(), new slime(), new slime()];
                break;
            case 2:
                this.monsters = [new slime(), new slime(), new succubus(), new succubus(), new succubus()];
                break;
            case 3:
                this.monsters = [new cacodemon(), new cacodemon(), new cacodemon(), new succubus(), new succubus()];
                break;
            case 4:
                this.monsters = [new baron(), new baron(), new cacodemon(), new succubus(), new boss()];
                break;
        }

        var potion = this.Item;
        switch (dungeonLevel) {
            case 1:
                this.items = [new potion(), new potion(), new potion(), new potion(), new potion()];
                break;
            default:
                this.items = [new potion(), new potion(), new potion(), wepAndArmour[0], wepAndArmour[1]];
        }

        // Set up transporter
        if (this.state.level.level !== 4) {
            var rnd = Math.floor(Math.random() * rooms.length);
            this.Item.transporter = new this.Item({});
            this.Item.transporter.char = 'X';
            this.Item.transporter.fg = 'purple';
            this.Item.transporter.name = 'Transporter';
            this.Item.transporter.type = 'transporter';
        }

        // This IIFE arrow function places monsters, items and the transporter in different rooms, ensuring they don't overlap. Preserves 'this'.
        (function () {
            // Get length of items & monsters array, and account for the transporter - then ensure there are no dupes with a for loop.
            var xAndY = _this2.monsters.length + _this2.items.length + 1,
                // Excess of +2 for indices, so subtract only one accounting for the transporter
            array = [];
            for (var i = 0; i < xAndY; i++) {
                var _rnd = Math.floor(Math.random() * rooms.length),
                    x = ROT.RNG.getUniformInt(rooms[_rnd]['_x1'], rooms[_rnd]['_x2']),
                    y = ROT.RNG.getUniformInt(rooms[_rnd]['_y1'], rooms[_rnd]['_y2']);
                if (i === 0) {
                    array.push(x + " " + y);
                } // Strings allow for identificiation & a 1d array with indexOf
                else if (array.indexOf(x + " " + y) !== -1) {
                        array.splice(i, 1);
                        i--;
                    } else {
                        array.push(x + " " + y);
                    }
            }
            // Var array now contains unique coords. Now split to 2d array with numbers.
            array = array.map(function (d) {
                var split = d.split(" ");
                return [Number(split[0]), Number(split[1])];
            });
            // Now place the monsters, items and transporter
            _this2.monsters = _this2.monsters.map(function (d) {
                var pop = array.pop();
                d.x = pop[0];
                d.y = pop[1];
                return d;
            });
            _this2.items = _this2.items.map(function (d) {
                var pop = array.pop();
                d.x = pop[0];
                d.y = pop[1];
                return d;
            });
            var pop = array.pop();
            _this2.Item.transporter.x = pop[0];
            _this2.Item.transporter.y = pop[1];
        })();

        this.mapLayout = mapLayout;
        this.drawMap();
    };

    Board.prototype.drawMap = function drawMap() {
        var _this3 = this;

        // Clear the display and redraw the current map according to FOV
        this.display.clear();
        var lightPasses = function lightPasses(x, y) {
            var key = x + "," + y;

            if (key in _this3.hash && _this3.hash[key] == 0) {
                return true;
            }
            return false;
        };

        var fov = new ROT.FOV.PreciseShadowcasting(lightPasses);

        fov.compute(this.Entity.player.x, this.Entity.player.y, 5, function (x, y, r) {

            var bg = _this3.hash[x + "," + y] ? _this3.Tile.wallTile.bg : _this3.Tile.landTile.bg;
            _this3.display.draw(x, y, '', '', bg);

            _this3.monsters.forEach(function (d) {
                if (d.x === x && d.y === y) {
                    _this3.display.draw(d.x, d.y, d.char, d.fg, d.bg);
                }
            });
            _this3.items.forEach(function (d) {
                if (d.x === x && d.y === y) {
                    _this3.display.draw(d.x, d.y, d.char, d.fg, d.bg);
                }
            });
            if (_this3.state.level.level !== 4 && _this3.Item.transporter.x === x && _this3.Item.transporter.y === y) {
                _this3.display.draw(_this3.Item.transporter.x, _this3.Item.transporter.y, _this3.Item.transporter.char, _this3.Item.transporter.fg, _this3.Item.transporter.bg);
            }
        });

        this.display.draw(this.Entity.player.x, this.Entity.player.y, this.Entity.player.char, this.Entity.player.fg, this.Entity.player.bg);

        this.setState({
            player: this.Entity.player
        });
    };

    Board.prototype.handleKey = function handleKey() {
        var _this4 = this;

        window.addEventListener('keydown', function (e) {
            var x = _this4.Entity.player.x,
                y = _this4.Entity.player.y;
            switch (e.keyCode) {
                case ROT.VK_LEFT:
                    checkMove(x - 1, y);
                    break;
                case ROT.VK_RIGHT:
                    checkMove(x + 1, y);
                    break;
                case ROT.VK_UP:
                    checkMove(x, y - 1);
                    break;
                case ROT.VK_DOWN:
                    checkMove(x, y + 1);
                    break;
            }
        });
        // Validate move, checking for walls, monsters & items. Keep track of important index.
        var index = 0;
        var checkMove = function checkMove(x, y) {
            // Helper function, checks if something is at the desired tile. Tracks index of item through the index var.
            var checkArray = function checkArray(arr, x, y) {
                return !arr.every(function (monster, i) {
                    if (monster.x === x && monster.y === y) {
                        index = i;
                        return false;
                    }
                    return true;
                });
            };
            if (checkArray(_this4.monsters, x, y)) {
                // Reference the monster & calculate damage dealt
                var focus = _this4.monsters[index],
                    playerAtk = _this4.Entity.player.atk + Math.floor(Math.random() * 10),
                    playerDmg = focus.atk + Math.floor(Math.random() * 10) - _this4.Entity.player.def;
                // Damage monster & player, display status
                playerDmg < 0 ? playerDmg = 0 : playerDmg; // Don't allow negative damage
                focus.hp -= playerAtk;
                _this4.Entity.player.hp -= playerDmg;
                if (_this4.Entity.player.hp <= 0) {
                    _this4.Entity.player = new _this4.Entity({});
                    _this4.display.clear();
                    _this4.mapSetup();
                    _this4.setState({
                        message: "You were killed by a " + focus.name + " in the last game.",
                        player: _this4.Entity.player,
                        level: {
                            level: 1,
                            name: "Spooky Dungeon"
                        }
                    });
                } else if (focus.hp <= 0) {
                    if (focus.type === "boss") {
                        _this4.Entity.player = new _this4.Entity({});
                        _this4.display.clear();
                        _this4.mapSetup();
                        swal("You killed the " + focus.name + "! You reached level " + _this4.Entity.player.lvl + " and had " + _this4.Entity.player.hp + " health left.");
                        _this4.setState({
                            message: "You killed Boss " + focus.name + "! You have won. A new game has been started.",
                            player: _this4.Entity.player,
                            level: {
                                level: 1,
                                name: "Spooky Dungeon"
                            }
                        });
                    } else {
                        var xpGranted = focus.yieldExp + Math.floor(Math.random() * 10);
                        _this4.levelUp(xpGranted);
                        _this4.setState({
                            message: "You killed a " + focus.name + " and gained " + xpGranted + " exp",
                            player: _this4.Entity.player
                        });
                        _this4.monsters.splice(index, 1);
                        _this4.drawMap();
                    }
                } else {
                    _this4.setState({
                        message: "Attacked " + focus.name + " for " + playerAtk + " damage, received " + playerDmg + " damage"
                    });
                }
            } else if (checkArray(_this4.items, x, y)) {
                var msg = "";
                // Check if the tile has a potion, weapon, piece of armour or transporter
                if (_this4.items[index].type === "potion") {
                    if (_this4.Entity.player.hp + _this4.items[index].hp <= 100) {
                        _this4.Entity.player.hp += _this4.items[index].hp;
                    } else {
                        _this4.Entity.player.hp = 100;
                    }
                    msg = "You found a potion, your hp has increased by " + _this4.items[index].hp;
                    _this4.items.splice(index, 1);
                } else if (_this4.items[index].type === "weapon") {
                    msg = "Found a weapon (" + _this4.items[index].name + ")!";
                    _this4.Entity.player.wep = _this4.items[index].name;
                    _this4.Entity.player.atk = _this4.items[index].atk;
                    _this4.items.splice(index, 1);
                    _this4.applyStats(true, false);
                } else if (_this4.items[index].type === "armour") {
                    msg = "Found armour (" + _this4.items[index].name + ")!";
                    _this4.Entity.player.armour = _this4.items[index].name;
                    _this4.Entity.player.def = _this4.items[index].def;
                    _this4.items.splice(index, 1);
                    _this4.applyStats(false, true);
                }

                _this4.setState({
                    player: _this4.Entity.player,
                    message: msg
                });
                _this4.drawMap();
            } else if (_this4.Item.transporter.x === x && _this4.Item.transporter.y === y) {
                _this4.changeLevel();
            } else if (!_this4.mapLayout[x][y].isWall) {
                _this4.Entity.player.x = x;
                _this4.Entity.player.y = y;
                _this4.drawMap();
            }
        };
    };
    // Level up the player

    Board.prototype.levelUp = function levelUp(exp) {
        this.Entity.player.exp += exp;
        if (this.Entity.player.exp >= this.Entity.player.lvl * 100) {
            this.Entity.player.hp < 75 ? this.Entity.player.hp += 25 : this.Entity.player.hp;
            this.Entity.player.lvl++;
            this.Entity.player.exp = 0;
            this.applyStats(true, true);
        }
    };
    // Apply level bonus to attack and defence on weapon/armour pickup & level up

    Board.prototype.applyStats = function applyStats(atk, def) {
        if (atk) {
            this.Entity.player.atk += this.Entity.player.lvl;
        }
        if (def) {
            this.Entity.player.def += this.Entity.player.lvl;
        }
        this.setState({
            player: this.Entity.player
        });
    };
    // Handle changing maps, generate weapons and armours appropriate for each level and pass them to mapSetup

    Board.prototype.changeLevel = function changeLevel() {
        if (this.state.level.level === 1) {
            this.setState({
                level: {
                    level: 2,
                    name: "2nd Floor"
                }
            });
            var wepNames = ["Short Katana", "Short Range Bow", "Deadly Dagger", "Iron Hammer", "Bronze Axe"],
                armNames = ["Leather Cuirass", "Iron Breastplate", "Steel Kneepads", "Light Plate", "Hide Garment"];
            var wep = new this.Item.weapon({
                name: wepNames[Math.floor(Math.random() * wepNames.length)],
                atk: 12
            });
            var armour = new this.Item.armour({
                name: armNames[Math.floor(Math.random() * armNames.length)],
                def: 6
            });
            var wepAndArmour = [wep, armour];
            this.mapSetup(2, wepAndArmour);
        } else if (this.state.level.level === 2) {
            this.setState({
                level: {
                    level: 3,
                    name: "3rd Floor"
                }
            });
            var wepNames = ["Kokiri Sword", "Weighted Mace", "Rapid Estoc", "Zweihander", "Blunderbuss"],
                armNames = ["Enchanted Robe", "Heavy Plate", "Intimidating Greaves", "Golden Gauntlets", "Cobalt Mail"];
            var wep = new this.Item.weapon({
                name: wepNames[Math.floor(Math.random() * wepNames.length)],
                atk: 17
            });
            var armour = new this.Item.armour({
                name: armNames[Math.floor(Math.random() * armNames.length)],
                def: 9
            });
            var wepAndArmour = [wep, armour];
            this.mapSetup(3, wepAndArmour);
        } else if (this.state.level.level === 3) {
            this.setState({
                level: {
                    level: 4,
                    name: "Throne Room"
                }
            });
            var wepNames = ["Sword of a Thousand Truths", "Master Sword", "Excalibur"],
                armNames = ["Godly Plate", "Titanium Mail", "Adamantine Armour"];
            var wep = new this.Item.weapon({
                name: wepNames[Math.floor(Math.random() * wepNames.length)],
                atk: 25
            });
            var armour = new this.Item.armour({
                name: armNames[Math.floor(Math.random() * armNames.length)],
                def: 15
            });
            var wepAndArmour = [wep, armour];
            this.mapSetup(4, wepAndArmour);
        }
    };

    Board.prototype.init = function init() {
        $('#board').append(this.display.getContainer());
        this.mapSetup();
        this.handleKey();
    };

    Board.prototype.componentDidMount = function componentDidMount() {
        this.init();
    };

    Board.prototype.render = function render() {
        return React.createElement(
            'div',
            { id: 'wrapper' },
            React.createElement(
                'div',
                { id: 'title' },
                'Level ',
                this.state.level.level,
                ' - ',
                this.state.level.name,
                ' - ',
                this.state.message
            ),
            React.createElement(
                'div',
                { id: 'details' },
                React.createElement(
                    'span',
                    { id: 'hp' },
                    'HP: ',
                    this.state.player.hp
                ),
                React.createElement(
                    'span',
                    { id: 'xp' },
                    ' - LVL: ',
                    this.state.player.lvl
                ),
                React.createElement(
                    'span',
                    { id: 'xp' },
                    ' EXP: ',
                    this.state.player.exp
                ),
                React.createElement(
                    'span',
                    { id: 'atk' },
                    ' - ATK: +',
                    this.state.player.atk,
                    ' ',
                    this.state.player.wep
                ),
                React.createElement(
                    'span',
                    { id: 'def' },
                    ' - DEF: +',
                    this.state.player.def,
                    ' ',
                    this.state.player.armour
                )
            ),
            React.createElement('div', { id: 'board' })
        );
    };

    return Board;
}(React.Component);

ReactDOM.render(React.createElement(Board, null), document.getElementById('render'));