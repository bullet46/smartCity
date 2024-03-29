# -- coding: utf-8--
import base64
import hashlib
import hmac
import importlib
import logging
import sys

from proton.handlers import MessagingHandler
from proton.reactor import Container

from DataBaseUpdate.CoreUpdater import *

importlib.reload(sys)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
console_handler = logging.StreamHandler(sys.stdout)


def current_time_millis():
    return str(int(round(time.time() * 1000)))


def do_sign(secret, sign_content):
    m = hmac.new(secret, sign_content, digestmod=hashlib.sha1)
    return base64.b64encode(m.digest())


class AmqpClient(MessagingHandler):
    def __init__(self):
        super(AmqpClient, self).__init__()
        self.update = Updater()

    def on_start(self, event):
        url = "amqps://1887392987831227.iot-amqp.cn-shanghai.aliyuncs.com"
        accessKey = ""
        accessSecret = "DM3bNYotPrhoqrKGdajnQcISgzxdeh"
        consumerGroupId = "DEFAULT_GROUP"
        # iotInstanceId：购买的实例请填写实例ID，公共实例请填空字符串""。
        iotInstanceId = ""
        clientId = "47.94.131.181"
        signMethod = "hmacsha1"
        timestamp = current_time_millis()
        # 按照阿里云IoT规范，组装UserName。
        userName = clientId + "|authMode=aksign" + ",signMethod=" + signMethod \
                   + ",timestamp=" + timestamp + ",authId=" + accessKey \
                   + ",iotInstanceId=" + iotInstanceId + ",consumerGroupId=" + consumerGroupId + "|"
        signContent = "authId=" + accessKey + "&timestamp=" + timestamp
        # 按照阿里云IoT规范，计算签名，组装password。
        print(userName)
        passWord = do_sign(accessSecret.encode("utf-8"), signContent.encode("utf-8"))
        print(passWord)
        passWord = str(passWord)
        passWord = passWord[2:-1]
        print(passWord)
        conn = event.container.connect(url, user=userName, password=passWord, heartbeat=60)
        self.receiver = event.container.create_receiver(conn)

    # 当连接成功建立被调用。
    def on_connection_opened(self, event):
        logger.info("Connection established, remoteUrl: %s", event.connection.hostname)

    # 当连接关闭时被调用。
    def on_connection_closed(self, event):
        logger.info("Connection closed: %s", self)

    # 当远端因错误而关闭连接时被调用。
    def on_connection_error(self, event):
        logger.info("Connection error")

    # 当建立AMQP连接错误时被调用，包括身份验证错误和套接字错误。
    def on_transport_error(self, event):
        if event.transport.condition:
            if event.transport.condition.info:
                logger.error("%s: %s: %s" % (
                    event.transport.condition.name, event.transport.condition.description,
                    event.transport.condition.info))
            else:
                logger.error("%s: %s" % (event.transport.condition.name, event.transport.condition.description))
        else:
            logging.error("Unspecified transport error")

    # 当收到消息时被调用。
    def on_message(self, event):
        message = event.message
        content = message.body.decode('utf-8')
        topic = message.properties.get("topic")
        message_id = message.properties.get("messageId")
        print()
        logger.info("receive message: message_id=%s, topic=%s, content=%s" % (message_id, topic, content))
        print()
        self.update.receive_new_message(content)
        event.receiver.flow(1)


try:
    Container(AmqpClient()).run()
except Exception as e:
    logging.error(e)
    Container(AmqpClient()).run()
