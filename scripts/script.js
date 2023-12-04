var selectedSquares = []; // 存储选中的方块
var isBulkColorPickerOpen = false;

function generateSquares() {
    var sideLength = parseInt(document.getElementById('sideLength').value) || 30;
    var width = parseInt(document.getElementById('width').value) || 10;
    var height = parseInt(document.getElementById('height').value) || 10;
    var container = document.getElementById('container');
    var existingColors = getColorsFromContainer(container); // 获取已有方块的颜色信息
    container.innerHTML = '';
    container.style.width = width * sideLength + 'px';
    container.style.height = height * sideLength + 'px';
    container.style.margin = sideLength + 'px';

    var minColumnWidth = sideLength + 'px';
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(' + minColumnWidth + ', 1fr))';
    var currentNumber = height + width - 1; // 初始化起始数字为height + width - 1
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var square = document.createElement('div');
            square.style.width = sideLength + 'px';
            square.style.height = sideLength + 'px';
            // 添加点击事件监听器
            square.addEventListener('click', function () {
                toggleSquareSelection(this);
            });
            // 设置方块的数字并显示
            square.textContent = Math.max(currentNumber--, 1);
            // 使数字水平和垂直居中
            square.style.display = 'flex';
            square.style.justifyContent = 'center';
            square.style.alignItems = 'center';
            // 恢复已有方块的颜色
            var color = existingColors.pop();
            if (color) {
                square.style.backgroundColor = color;
            }
            container.appendChild(square);
        }
        // 每行递减完成，更新初始数字
        currentNumber = height + width - 2 - i;
    }
}

// 获取已有方块的颜色信息
function getColorsFromContainer(container) {
    var squares = container.querySelectorAll('div');
    var colors = [];
    squares.forEach(function (square) {
        colors.push(square.style.backgroundColor);
    });
    return colors.reverse(); // 反转数组，以便从最后一个方块开始应用颜色
}

function toggleSquareSelection(square) {
    // 切换方块的选择状态
    square.classList.toggle('selected');
    // 将选中的方块存储在数组中
    if (square.classList.contains('selected')) {
        selectedSquares.push(square);
    } else {
        // 如果方块取消选择，则从数组中移除
        var index = selectedSquares.indexOf(square);
        if (index !== -1) {
            selectedSquares.splice(index, 1);
        }
    }
}

// 清除选中状态的函数
function clearSelection() {
    selectedSquares.forEach(function (square) {
        square.classList.remove('selected');
    });
    selectedSquares = []; // 清空选中方块数组
}

// 更新颜色种类的显示
function updateColorCategories() {
    var colorCategories = document.getElementById('colorCategories');
    colorCategories.innerHTML = ''; // 清空原有内容
    var allSquares = document.querySelectorAll('#container > div');
    var uniqueColors = getUniqueColors(allSquares); // 获取所有唯一的颜色
    uniqueColors.forEach(function (color, index) {
        var colorCategory = document.createElement('div');
        colorCategory.className = 'colorCategory';
        var colorSquareContainer = document.createElement('div');
        colorSquareContainer.className = 'colorSquareContainer';
        var colorSquare = document.createElement('div');
        colorSquare.className = 'colorSquare';
        colorSquare.style.backgroundColor = color;
        var colorInfo = document.createElement('span');
        colorInfo.className = 'colorInfo';
        colorInfo.textContent = ': ' + rgbToHex(color); // 冒号在这里
        colorSquareContainer.appendChild(colorSquare);
        colorSquareContainer.appendChild(colorInfo);
        colorCategory.appendChild(colorSquareContainer);
        colorCategories.appendChild(colorCategory);
    });
}

// 将 RGB 颜色值转换为 HEX 格式
function rgbToHex(rgb) {
    var hex = rgb.split('(')[1].split(')')[0]
        .split(',')
        .map(function (x) {
            return ('0' + parseInt(x).toString(16)).slice(-2);
        })
        .join('');
    return '#' + hex;
}

// 获取所有唯一的颜色
function getUniqueColors(squares) {
    var colors = [];
    squares.forEach(function (square) {
        var color = square.style.backgroundColor;
        if (color && colors.indexOf(color) === -1) {
            colors.push(color);
        }
    });
    return colors;
}

// 打开颜色选择器
function openColorPicker() {
    if (isBulkColorPickerOpen) {
        return; // 如果一键修改颜色选择器已经打开，则阻止打开单个颜色选择器
    }
    var colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.addEventListener('change', function () {
        var color = colorInput.value;
        selectedSquares.forEach(function (square) {
            square.style.backgroundColor = color;
        });
        updateColorCategories();
        clearSelection();
    });
    colorInput.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            colorInput.dispatchEvent(new Event('change'));
        }
    });
    colorInput.click();
}

// 打开一键修改颜色选择器
function openBulkColorPicker() {
    var colorInput = document.createElement('input');
    colorInput.type = 'color';
    // 添加 change 事件监听器
    colorInput.addEventListener('change', function () {
        var color = colorInput.value;
        var allSquares = document.querySelectorAll('#container > div');
        // 更新所有方块的背景颜色
        allSquares.forEach(function (square) {
            square.style.backgroundColor = color;
        });
        // 更新颜色种类的显示
        updateColorCategories();
        // 取消之前的选中状态
        clearSelection();
    });
    // 添加 keyup 事件监听器
    colorInput.addEventListener('keyup', function (event) {
        // 如果按下的是回车键（keyCode 为 13）
        if (event.keyCode === 13) {
            // 触发 change 事件，完成颜色修改
            colorInput.dispatchEvent(new Event('change'));
        }
    });
    // 模拟点击 input 元素
    colorInput.click();
}

// 打开数字颜色选择器
function openNumberColorPicker() {
    if (isBulkColorPickerOpen) {
        return; // 如果一键修改颜色选择器已经打开，则阻止打开单个颜色选择器
    }
    var colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.addEventListener('change', function () {
        var color = colorInput.value;
        selectedSquares.forEach(function (square) {
            square.style.color = color; // 修改数字的颜色
        });
        updateColorCategories();
        clearSelection();
    });
    colorInput.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            colorInput.dispatchEvent(new Event('change'));
        }
    });
    colorInput.click();
}

// 新增的按钮点击事件
function editColorInfo() {
    var colorInfoElements = Array.from(document.querySelectorAll('.colorInfo'));
    colorInfoElements.forEach(function (colorInfo) {
        var originalText = colorInfo.textContent;
        // 创建可编辑的文本框
        var input = document.createElement('input');
        input.type = 'text';
        input.value = originalText;
        // 将文本框插入到 colorInfo 的前面
        colorInfo.parentNode.insertBefore(input, colorInfo);
        // 设置文本框获取焦点
        input.focus();
        // 按下回车键时保存修改
        input.addEventListener('keyup', function (event) {
            if (event.keyCode === 13) {
                saveColorInfo(input, originalText);
            }
        });
        // 移除原始的 colorInfo 元素
        colorInfo.remove();
    });
}

// 保存修改后的文本
function saveColorInfo(input, originalText) {
    var newInfo = input.value;
    // 创建新的 colorInfo 元素
    var newColorInfo = document.createElement('span');
    newColorInfo.className = 'colorInfo';
    newColorInfo.textContent = newInfo;
    // 将新的 colorInfo 插入到文本框的前面
    input.parentNode.insertBefore(newColorInfo, input);
    // 移除文本框
    input.remove();
}

// 新增的按钮点击事件
function generateNumberCircles() {
    var container = document.getElementById('container');
    var width = parseInt(document.getElementById('width').value) || 10;
    var height = parseInt(document.getElementById('height').value) || 10;
    var sideLength = parseInt(document.getElementById('sideLength').value) || 30;
    // 获取已存在的 number-circles
    var existingNumberCircles = document.querySelector('.number-circles');
    // 如果已存在，移除并返回
    if (existingNumberCircles) {
        existingNumberCircles.remove();
        return;
    }
    // 创建父级div
    var parentDiv = document.createElement('div');
    parentDiv.className = 'number-circles';
    parentDiv.style.border = 'none';
    parentDiv.style.color = '#d11717';
    // 获取 container 的位置信息
    var containerRect = container.getBoundingClientRect();
    // 设置 number-circles 尺寸和相对于 container 的位置
    var sizeAdjustment = 2 * sideLength;
    parentDiv.style.width = containerRect.width + sizeAdjustment + 'px';
    parentDiv.style.height = containerRect.height + sizeAdjustment + 'px';
    parentDiv.style.position = 'absolute';

    // 居中显示
    parentDiv.style.top = containerRect.top - sideLength + 'px';
    parentDiv.style.left = containerRect.left - sideLength + 'px';
    container.appendChild(parentDiv);
    // 生成数字并按规律排列
    var totalNumbers = height + width - 1;
    var addedNumbers = new Set(); // 用于记录已经添加的数字
    // 清空滚动效果
    document.body.style.overflow = 'hidden';
    var createNumberDiv = function (number, position) {
        // 判断奇偶性
        var isOdd = number % 2 !== 0;
        // 如果在上边或右边，只显示奇数
        // 如果在下边或左边，只显示偶数
        if ((position === 'top' || position === 'right') && !isOdd) {
            return;
        } else if ((position === 'bottom' || position === 'left') && isOdd) {
            return;
        }
        // 如果数字已经添加过，则不重复添加
        if (addedNumbers.has(number)) {
            return;
        }
        // 创建数字 div
        var numberDiv = document.createElement('div');
        numberDiv.textContent = number;
        numberDiv.style.width = sideLength + 'px'; // 设置宽度为边长
        numberDiv.style.height = sideLength + 'px'; // 设置高度为边长
        numberDiv.style.margin = '0'; // 设置 margin 为 0
        numberDiv.style.padding = '0'; // 设置 padding 为 0
        numberDiv.style.border = 'none'; // 取消边框
        numberDiv.style.color = '#d11717'; // 设置文字颜色
        numberDiv.style.display = 'flex'; // 使用 flex 布局
        numberDiv.style.justifyContent = 'center'; // 水平居中
        numberDiv.style.alignItems = 'center'; // 垂直居中
        numberDiv.style.fontWeight = 'bold';
        parentDiv.appendChild(numberDiv);
        // 设置 numberDiv 在 container 下方
        numberDiv.style.zIndex = '1'; // 调整图层位置，放在 container 下方
        // 将数字添加到已添加的集合中
        addedNumbers.add(number);
        // 计算相对位置
        var distancetop = sideLength * (height + width - number);
        var distanceright = sideLength * (height + 1 - number);
        var distancebottom = sideLength * (width + 1 - number);
        var distanceleft = sideLength * (height + width - number);
        // 根据位置信息设置样式
        switch (position) {
            case 'top':
                numberDiv.style.position = 'absolute';
                numberDiv.style.top = '0';
                numberDiv.style.left = distancetop + 'px';
                break;
            case 'right':
                numberDiv.style.position = 'absolute';
                numberDiv.style.top = distanceright + 'px';
                numberDiv.style.right = '0';
                break;
            case 'bottom':
                numberDiv.style.position = 'absolute';
                numberDiv.style.bottom = '0';
                numberDiv.style.left = distancebottom + 'px';
                break;
            case 'left':
                numberDiv.style.position = 'absolute';
                numberDiv.style.top = distanceleft + 'px';
                numberDiv.style.left = '0';
        }
    };
    // 上边
    for (var i = height + width - 1; i >= height && i >= 1; i -= 1) {
        createNumberDiv(i, 'top');
    }
    // 右边
    for (var j = height; j >= 1; j -= 1) {
        createNumberDiv(j, 'right');
    }
    // 下边
    for (var k = width; k >= 1; k -= 1) {
        createNumberDiv(k, 'bottom');
    }
    // 左边
    for (var l = height + width - 1; l >= width && l >= 1; l -= 1) {
        createNumberDiv(l, 'left');
    }
    // 增加延迟确保正确渲染
    setTimeout(() => {
        // 恢复滚动效果
        document.body.style.overflow = 'auto';

        // your existing code for generateNumberCircles
    }, 100); // 调整延迟时间，如果需要更长的等待时间，请适度增加
}

function downloadImage() {
    var container = document.getElementById('container');
    var numberCircles = document.querySelector('.number-circles');
    var colorCategories = document.getElementById('colorCategories');
    var containerConfig = document.getElementById('container-config');

    // 创建一个元素排除列表
    var excludeList = []; // 不再排除任何元素，包括 container-config

    // 获取当前页面的滚动位置
    var scrollX = window.scrollX || document.documentElement.scrollLeft;
    var scrollY = window.scrollY || document.documentElement.scrollTop;

    // 使用html2canvas并设置排除选项、滚动位置和窗口大小
    html2canvas(document.body, {
        ignoreElements: function (element) {
            // 检查元素是否在排除列表中
            return excludeList.includes(element);
        },
        windowWidth: document.body.scrollWidth,
        windowHeight: document.body.scrollHeight,
        scrollX: scrollX,
        scrollY: scrollY,
    }).then(function (canvas) {
        var link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'screenshot.png';

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
    });
}






