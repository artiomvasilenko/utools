Теперь ты можешь управлять ботом как полноценной системной службой:

Остановить:
sudo systemctl stop gunicorn

Запустить снова:
sudo systemctl start gunicorn

Перезапустить:
sudo systemctl restart gunicorn


Системная служба
sudo nano /etc/systemd/system/gunicorn

Проект в пути
cd /var/backend

Активация виртуального окружения
source venv/bin/activate



IP-адреса(SSH ready)
45.135.164.127
Авторизация на сервере
user:		root	
pass:		
XKpX5Dc8ib