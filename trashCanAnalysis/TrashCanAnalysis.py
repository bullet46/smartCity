import logging
import re

import pymysql


def space_recommend_single(space_allot_now: str, space_state: list, can_height: float):
    """
    用于描述单独时间节点的垃圾区域分配推荐方式
    :param space_allot_now: 目前分配的空间状态 str 格式 如20:20:30:30  其它垃圾:可回收:厨余垃圾:有害垃圾距顶高度
    :param space_state: 目前空间状态 list 其它垃圾:可回收:厨余垃圾:有害垃圾
    :param can_height: 目前垃圾桶高度 单位cm
    :return: 推荐分配状态,返回的百分比,如 25.4:24.6:25.0:25.0
    """
    space_allot_now = space_allot_now.split(':')
    space_allot_now = [int(i) / 100 for i in space_allot_now]
    print(space_allot_now)
    space_state_percent = []  # 按照百分比进行目前区域垃圾/所有垃圾的计算
    all_trash_percent = 0  # 目前所有垃圾占总区域的量
    for i in range(4):
        all_trash_percent = all_trash_percent + (space_state[i] / can_height) * space_allot_now[i]
    print()
    for i in range(4):
        space_state_percent.append(
            ((space_state[i] / can_height) * space_allot_now[i]) / all_trash_percent * 100)
    print(max(space_state_percent))
    if 10 < max(space_state_percent) or max(space_state_percent) < 90:  # 统计策略
        return None
    else:
        return space_state_percent


class SpaceTimeRecommend:
    def __init__(self):
        # 进行数据库的连接
        logging.basicConfig(format='%(asctime)s - %(levelname)s: %(message)s', level=logging.DEBUG)
        try:
            self.db_trash_data = pymysql.connect("localhost", "trash_data", "741236985lxh", "trash_data")
            logging.info("连接成功")
        except Exception as e:
            logging.error("连接失败" + str(e))

    def table_exists(self, table_name):  # 用于查询指定表是否存在
        sql = "show tables;"
        cursor = self.db_trash_data.cursor()
        cursor.execute(sql)
        tables = [cursor.fetchall()]
        table_list = re.findall('(\'.*?\')', str(tables))
        table_list = [re.sub("'", '', each) for each in table_list]
        if table_name in table_list:
            return True  # 存在时返回True
        else:
            return False

    def find_single_trash_by_date(self, date: str, device_id: int):
        """
        查找某一天某个垃圾桶的所有数据
        :param date: str 日期，格式为"2020-07-08"
        :param device_id:以设备id的形式进行查找
        :return:data : dict ，格式例如{"22:00:14":[15,13,15,17]} 值所对应的list表示 其它垃圾:可回收:厨余垃圾:有害垃圾距顶高度
        """
        cursor = self.db_trash_data.cursor()
        trash_date = 'trash_date_' + str(date.replace('-', '_'))
        cursor.execute("""
            select * from {trash_date} where device_id ={device_id};
        """.format(trash_date=trash_date, device_id=device_id))
        result = cursor.fetchall()
        data = {}
        for i in range(len(result)):
            time = str(result[i][1]).split(' ')[1]
            space = [result[i][8], result[i][6], result[i][7], result[i][9]]
            data.update({time: space})
        logging.info(data)
        return data

    



if __name__ == '__main__':
    space_allot_now = '25:25:25:25'
    space_state = [0, 30, 0, 0]
    can_height = 30
    space = SpaceTimeRecommend()
    space.find_single_trash_by_date('2020-07-08', 1)
