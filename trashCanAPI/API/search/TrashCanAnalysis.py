import datetime
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
    space_state_percent = []  # 按照百分比进行目前区域垃圾/所有垃圾的计算
    all_trash_percent = 0  # 目前所有垃圾占总区域的量
    for i in range(4):
        all_trash_percent = all_trash_percent + (space_state[i] / can_height) * space_allot_now[i]
    for i in range(4):
        space_state_percent.append(
            ((space_state[i] / can_height) * space_allot_now[i]) / all_trash_percent * 100)
    print(max(space_state_percent))
    if 10 < max(space_state_percent) or max(space_state_percent) < 90:  # 统计策略
        return None
    else:
        return space_state_percent


class TrashCanFound:
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

    def statistic_all_device(self):
        """
        统计目前设备中有多少垃圾桶
        :return: device_max
        """
        cursor = self.db_trash_data.cursor()
        cursor.execute("""
            select max(device_id) from trash_info;
        """)
        result = cursor.fetchall()
        return result[0][0]

    def find_single_trash_info(self, device_id=None, device_name=None):
        """
        通过id或者name查询垃圾桶信息
        :param device_id: 可以通过device_id来查询数据
        :param device_name: 也可以通过device_name来查询
        :return: device_info = {device:id : ,time : ,device_name:,device_space_now:,device_space_recommend:,
        recovery_time: ,can_height:}
        """
        cursor = self.db_trash_data.cursor()
        info = {}
        if device_id is not None:
            cursor.execute("""
                select * from trash_info where device_id ={device_id};
            """.format(device_id=device_id))
        elif device_name is not None:
            cursor.execute("""
                select * from trash_info where device_name ="{device_name}";
            """.format(device_name=device_name))
        else:
            return None
        result = cursor.fetchall()
        info.update(
            {
                "device_id": result[0][0],
                "time": str(result[0][1]),
                "device_name": result[0][2],
                "device_space_now": result[0][3],
                "device_space_recommend": result[0][4],
                "recovery_time": result[0][5],
                "can_height": result[0][6]
            }
        )
        return info

    def find_all_trash_info(self):
        """
        查找所有垃圾桶的info信息
        :return:{id:{},...}
        """
        max_id = self.statistic_all_device()
        all_info = {}
        for i in range(1, max_id+1):
            try:
                all_info.update(
                    {
                        str(i): self.find_single_trash_info(device_id=i)
                    }
                )
            except Exception as e:
                logging.error(e)
                pass
        return all_info

    def find_state_trash_by_date(self, date: str, device_id: int):
        """
        查找某一天某个垃圾桶的存量程度曲线
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

    def find_single_trash_now(self, device_id: int) -> dict:
        """
        查找目前单个垃圾桶的状态
        :param device_id:以设备id的形式进行查找
        :return: single_data {device_id:{device_name:,temperature,humidity,recyclable_distance...},'}
        """
        cursor = self.db_trash_data.cursor()
        date = str(datetime.date.today())
        trash_date = 'trash_date_' + str(date.replace('-', '_'))
        cursor.execute("""
                    select * from {trash_date} where device_id = {device_id} and
                     message_id=(select max(message_id) from {trash_date} where device_id ={device_id});
                """.format(trash_date=trash_date, device_id=device_id))
        result = cursor.fetchall()
        single_data = {}
        single_data.update(
            {
                "time": str(result[0][1]),
                "device_id":result[0][2],
                "device_name": result[0][3],
                "temperature": result[0][4],
                "humidity": result[0][5],
                "recyclable": result[0][6],
                "kitchen_distance": result[0][7],
                "others_distance": result[0][8],
                "harmful_distance": result[0][9],
                "geo_location": result[0][10]
            }
        )
        return single_data

    def find_all_trash_now(self):
        """
        查找目前所有垃圾桶的最新状态
        :return: all_trash_state {device_id:{device_name:,temperature,humidity,recyclable_distance...},'}
        """
        max_id = self.statistic_all_device()
        all_trash_state = {}
        for id in range(1,max_id+1):
            try:
                all_trash_state.update(
                    {
                        str(id): self.find_single_trash_now(device_id=id)
                    }
                )
            except Exception as e:
                logging.error(e)
                pass
        return all_trash_state




if __name__ == '__main__':
    space_allot_now = '25:25:25:25'
    space_state = [0, 30, 0, 0]
    can_height = 30
    space = TrashCanFound()
    print(space.find_all_trash_info())
