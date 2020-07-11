import json

import requests

if __name__ == '__main__':
    lists = ['device_info_name=垃圾桶', "device_info_all", "device_data_id_now=2", "device_data_all_now"
        , """device_data_search_by_day={"device_id":1,"date":"2020-07-10"}"""]
    r = requests.get('http://47.94.131.181:2333/API/', params=lists[1])
    print(r.text)
    text = json.loads(str(r.text).replace("'", '"'))
    print(text['2']['can_height'])
