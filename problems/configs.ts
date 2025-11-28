import { ProblemConfig, ProblemType } from '../types';

export const PROBLEMS: Record<ProblemType, ProblemConfig> = {
  [ProblemType.WATER]: {
    id: ProblemType.WATER,
    title: "草原上的水",
    description: "牛村派人给羊村送水。刚出发时共有 k 瓶一样大小的水，总重量不超过 n 千克。到达时车上剩余水总重 Y 千克。请问路上可能消耗了多少千克水？",
    defaultInput: "10 6 40",
    codeTemplate: `int Y, k, n;
cin >> Y >> k >> n;
bool found = false;
// 枚举单瓶水的重量 bw
// 隐含条件: 总重量 = 单瓶重 * 瓶数 k
for(int bw = 1; bw * k <= n; bw++) {
    int total = bw * k; // 出发时的总重量
    int consumed = total - Y; // 消耗量
    if (consumed >= 0) {
        cout << consumed << " ";
        found = true;
    }
}
if(!found) cout << -1;`
  },
  [ProblemType.BLOOD_PRESSURE]: {
    id: ProblemType.BLOOD_PRESSURE,
    title: "正常血压",
    description: "监护室每小时测量一次血压。正常范围：收缩压 90-140，舒张压 60-90。计算病人保持正常血压的最长连续小时数。",
    defaultInput: `4
100 80
90 50
120 60
140 90`,
    codeTemplate: `int n; cin >> n;
int maxH = 0, currH = 0; // maxH:最大时长, currH:当前时长
for(int i=0; i<n; i++) {
    int s, d; cin >> s >> d;
    // 判断是否在正常范围内
    if(s>=90 && s<=140 && d>=60 && d<=90) {
        currH++;
        if(currH > maxH) maxH = currH;
    } else {
        currH = 0; // 中断了，重置为0
    }
}
cout << maxH;`
  },
  [ProblemType.QUEUE]: {
    id: ProblemType.QUEUE,
    title: "队列人数",
    description: "求校体操队至少多少人：排成2、3、4、5、6人一行都多1人，排成7人一行正好不多。",
    defaultInput: "",
    codeTemplate: `int x = 7;
while(true) {
    // 检查是否满足除以2-6都余1
    if(x%2==1 && x%3==1 && 
       x%4==1 && x%5==1 && x%6==1) {
       // 检查是否能被7整除
       if(x%7==0) {
           cout << x;
           break;
       }
    }
    x += 7; // 因为必须是7的倍数，所以每次加7
}`
  },
  [ProblemType.POKER]: {
    id: ProblemType.POKER,
    title: "扑克牌游戏",
    description: "不断摸牌，手上的牌点数之和不能超过10，否则就爆了。输入10张牌的点数，输出应该抓到第几张停手。",
    defaultInput: "2 3 4 8 2 1 9 4 6 3",
    codeTemplate: `int sum = 0;
for(int i=0; i<10; i++) {
    int card; cin >> card;
    // 如果拿了这张牌会超过10
    if(sum + card > 10) {
        cout << i; // 输出拿之前的张数
        return 0;
    }
    sum += card;
}`
  },
  [ProblemType.FIND_THREE]: {
    id: ProblemType.FIND_THREE,
    title: "寻找第一个3",
    description: "输入10个整数，找到第一个数字3所在的位置（第几个）。若不存在输出No。",
    defaultInput: "4 2 23 4 5 6 7 3 9 245",
    codeTemplate: `bool found = false;
for(int i=1; i<=10; i++) {
    int num; cin >> num;
    if(num == 3) {
        cout << i; // 输出位置
        found = true;
        break;
    }
}
if(!found) cout << "No";`
  },
};
