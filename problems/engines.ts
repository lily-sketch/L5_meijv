import { ProblemType, SimulationResult } from '../types';
import { createStep, parseInput } from './utils';

// ----------------------------------------------------------------------
// PROBLEM 1: Water on Grassland
// ----------------------------------------------------------------------
export const generateWaterSteps = (input: string): SimulationResult => {
  const nums = parseInput(input);
  if (nums.length < 3) return { steps: [], error: "需要3个数字: Y, k, n" };
  const [Y, k, n] = nums;
  const steps = [];

  steps.push(createStep(0, "读取输入 Y, k, n", { Y, k, n, possible_weights: [] }));
  
  let found = false;
  const outputs = [];

  steps.push(createStep(1, "初始化标记变量", { Y, k, n, found: false }));

  const maxBW = Math.floor(n / k);
  
  for (let bw = 1; bw <= maxBW; bw++) {
    const total = bw * k;
    steps.push(createStep(2, `尝试单瓶水重量: ${bw}kg。出发总重 = ${bw} * ${k} = ${total}kg`, { bw, total, Y, k, n, found }));
    
    const consumed = total - Y;
    steps.push(createStep(3, `计算消耗: ${total} - ${Y} = ${consumed}`, { bw, total, consumed, Y, found }));

    if (consumed >= 0) {
      outputs.push(consumed);
      found = true;
      steps.push(createStep(4, `合法！输出消耗量 ${consumed}`, { bw, total, consumed, found: true }, [], outputs.join(" ")));
    } else {
      steps.push(createStep(4, `无效 (消耗量 < 0)。跳过。`, { bw, total, consumed, found }, [], outputs.join(" ")));
    }
  }

  if (!found) {
    steps.push(createStep(6, "未找到解，输出 -1", { found }, [], "-1"));
  } else {
    steps.push(createStep(6, "程序结束", { found }, [], outputs.join(" ")));
  }

  return { steps };
};

// ----------------------------------------------------------------------
// PROBLEM 2: Normal Blood Pressure
// ----------------------------------------------------------------------
export const generateBPSteps = (input: string): SimulationResult => {
  const nums = parseInput(input);
  if (nums.length === 0) return { steps: [], error: "没有输入数据" };
  
  const n = nums[0];
  if (nums.length < 1 + n * 2) return { steps: [], error: `期望 ${n} 组数据` };

  const readings = [];
  for(let i=0; i<n; i++) {
    readings.push({ sys: nums[1 + i*2], dia: nums[1 + i*2 + 1] });
  }

  const steps = [];

  steps.push(createStep(0, `读取总次数 n=${n}`, { n, maxHour: 0, currentHour: 0, i: -1 }));
  
  let maxHour = 0;
  let currentHour = 0;

  for (let i = 0; i < n; i++) {
    const { sys, dia } = readings[i];
    steps.push(createStep(2, `循环 i=${i}。当前读数: ${sys}/${dia}`, { n, maxHour, currentHour, i, sys, dia }, [i]));
    
    const isNormal = (sys >= 90 && sys <= 140 && dia >= 60 && dia <= 90);
    steps.push(createStep(4, `判断正常: 90<=收缩<=140 且 60<=舒张<=90? -> ${isNormal ? '是' : '否'}`, { n, maxHour, currentHour, i, sys, dia, isNormal }, [i]));

    if (isNormal) {
      currentHour++;
      steps.push(createStep(5, `正常！连续时长 +1，当前为 ${currentHour}`, { n, maxHour, currentHour, i }, [i]));
      if (currentHour > maxHour) {
        maxHour = currentHour;
        steps.push(createStep(6, `破纪录了！最大连续时长更新为 ${maxHour}`, { n, maxHour, currentHour, i }, [i]));
      }
    } else {
      currentHour = 0;
      steps.push(createStep(8, `血压异常。连续时长重置为 0`, { n, maxHour, currentHour, i }, [i]));
    }
  }
  
  steps.push(createStep(11, `输出最大连续时长: ${maxHour}`, { maxHour }, [], maxHour.toString()));
  
  return { steps };
};

// ----------------------------------------------------------------------
// PROBLEM 3: Queue
// ----------------------------------------------------------------------
export const generateQueueSteps = (): SimulationResult => {
  const steps = [];

  steps.push(createStep(0, "从最小的7的倍数 x=7 开始尝试", { x: 7 }));
  
  let x = 7;
  let safety = 0;
  while(safety < 1000) {
    safety++;
    const cond = (x % 2 === 1 && x % 3 === 1 && x % 4 === 1 && x % 5 === 1 && x % 6 === 1);
    
    if (x <= 49 || x === 301 || (x > 290)) {
        steps.push(createStep(2, `检查 x=${x}。是否除以2,3,4,5,6都余1？`, { x, cond }));
        if (cond) {
             steps.push(createStep(3, `满足条件1！检查 x 是否能被7整除`, { x }));
             if (x % 7 === 0) {
                 steps.push(createStep(4, `找到了！${x} 符合所有条件`, { x }, [], x.toString()));
                 break;
             }
        } else {
             steps.push(createStep(7, `条件不满足。尝试下一个7的倍数`, { x }));
        }
    } else if (x === 56) {
        steps.push(createStep(7, `... 中间过程省略 ...`, { x: "..." }));
    }

    if (cond && x % 7 === 0) break;
    x += 7;
  }

  return { steps };
};

// ----------------------------------------------------------------------
// PROBLEM 4: Poker Game
// ----------------------------------------------------------------------
export const generatePokerSteps = (input: string): SimulationResult => {
  const nums = parseInput(input);
  if (nums.length < 10) return { steps: [], error: "需要10个数字" };
  
  const steps = [];

  steps.push(createStep(0, "初始化总和 sum = 0", { sum: 0, i: 0, card: null }));

  let sum = 0;
  let done = false;
  for (let i = 0; i < 10; i++) {
    const card = nums[i];
    steps.push(createStep(2, `读取第 ${i+1} 张牌: 点数 ${card}`, { sum, i, card }, [i]));

    steps.push(createStep(3, `检查: 当前总和 ${sum} + 新牌 ${card} 是否 > 10?`, { sum, i, card, nextSum: sum + card }, [i]));

    if (sum + card > 10) {
      steps.push(createStep(4, `爆掉了！${sum + card} > 10。在抓第 ${i+1} 张前停手，共抓了 ${i} 张。`, { sum, i, card }, [i], i.toString()));
      done = true;
      break;
    }

    sum += card;
    steps.push(createStep(7, `安全。总和更新为 ${sum}`, { sum, i, card }, [i]));
  }
  
  if (!done) {
     steps.push(createStep(8, "所有牌都抓完了也没有爆！", { sum }, [], "10"));
  }

  return { steps };
};

// ----------------------------------------------------------------------
// PROBLEM 5: Find First 3
// ----------------------------------------------------------------------
export const generateFindThreeSteps = (input: string): SimulationResult => {
  const nums = parseInput(input);
  if (nums.length < 10) return { steps: [], error: "需要10个数字" };

  const steps = [];

  steps.push(createStep(0, "开始查找，初始化 found = false", { found: false, i: 1 }));

  let found = false;
  for (let i = 0; i < 10; i++) {
    const num = nums[i];
    const displayIndex = i + 1;
    
    steps.push(createStep(2, `检查第 ${displayIndex} 个数: 值是 ${num}`, { i: displayIndex, num, found }, [i]));

    if (num === 3) {
      steps.push(createStep(4, `在位置 ${displayIndex} 找到了数字 3！输出位置。`, { i: displayIndex, num, found: true }, [i], displayIndex.toString()));
      found = true;
      break;
    } else {
        steps.push(createStep(3, `${num} 不是 3。继续。`, { i: displayIndex, num, found }, [i]));
    }
  }

  if (!found) {
    steps.push(createStep(7, "循环结束。没有找到 3。", { found }, [], "No"));
  }

  return { steps };
};
