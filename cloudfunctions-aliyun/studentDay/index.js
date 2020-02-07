'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const collection = db.collection('daily_report_log')
	// 获取当前用户数据列表
	const res = await collection.where({
		class_id: event.class_id
	}).get()
	
	const new_time = new Date().getTime()
	// 删除当天的记录
	for (var i = 0; i < res.data.length; i++) {
		// 判断是否当天
		if (res.data[i].create_time.toString().substr(0, 6) === new_time.toString().substr(0, 6)) {
			collection.doc(res.data[i]._id).remove() //删除
		}
	}
	
	// 添加记录
	const res_add = await collection.add(event)
	return res_add
};
