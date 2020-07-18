"""
不建立orm映射关系，使用sql函数进行表查询
"""
import json

from api.search import TrashCanAnalysis


class TrashCanShow(TrashCanAnalysis.TrashCanFound):
    def __init__(self):
        super().__init__()

    def trash_message(self, message: str):
        """
        针对http请求中get参数进行回应
        :param message:
        包含device_name或device_id或all
        应对trash_info为参数体的get请求
        传入形式为
        :return:
        """
        if message.find('device_info_name=') == 0:
            message = message.split('=')
            return self.find_single_trash_info(device_name=str(message[1]))

        elif message.find('device_info_id=') == 0:
            message = message.split('=')
            return self.find_single_trash_info(device_id=int(message[1]))

        elif message.find('device_info_all') == 0:
            return self.find_all_trash_info()

        elif message.find('device_data_id_now=') == 0:
            message = message.split('=')
            return self.find_single_trash_now(device_id=int(message[1]))

        elif message.find('device_data_all_now') == 0:
            return self.find_all_trash_now()

        elif message.find('device_data_search_by_day=') == 0:
            # 这里应该输入id以及日期
            # device_data_search_by_day={"device_id":1,"date":"2020-07-18"}
            message = message.split('=')

            try:
                message[1] = message[1].replace("'", '"')
                result = json.loads(message[1])
                return self.find_state_trash_by_date(date=result['date'], device_id=int(result['device_id']))
            except:
                return None
        else:
            return None


if __name__ == '__main__':
    trash = TrashCanShow()
    print(trash.trash_message('device_info_name=李星海'))
    print()
    print(trash.trash_message('device_info_all='))
    print()
    print(trash.trash_message('device_data_id_now=2'))
    print()
    print(trash.trash_message('device_data_all_now'))
    print()
    print(trash.trash_message('device_data_search_by_day={"device_id":1,"date":"2020-07-10"}'))
