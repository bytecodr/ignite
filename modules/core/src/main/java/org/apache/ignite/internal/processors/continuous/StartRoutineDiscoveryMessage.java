/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.ignite.internal.processors.continuous;

import org.apache.ignite.*;
import org.apache.ignite.internal.managers.discovery.*;
import org.apache.ignite.internal.util.typedef.internal.*;

import java.util.*;

/**
 *
 */
public class StartRoutineDiscoveryMessage extends AbstractContinuousMessage {
    /** */
    private static final long serialVersionUID = 0L;

    /** */
    private final StartRequestData startReqData;

    /** */
    private final Map<UUID, IgniteCheckedException> errs = new HashMap<>();

    /**
     * @param routineId Routine id.
     * @param startReqData Start request data.
     */
    public StartRoutineDiscoveryMessage(UUID routineId, StartRequestData startReqData) {
        super(routineId);

        this.startReqData = startReqData;
    }

    /**
     * @return Start request data.
     */
    public StartRequestData startRequestData() {
        return startReqData;
    }

    /**
     * @param nodeId Node id.
     * @param e Exception.
     */
    public void addError(UUID nodeId, IgniteCheckedException e) {
        errs.put(nodeId, e);
    }

    /**
     * @return Errs.
     */
    public Map<UUID, IgniteCheckedException> errs() {
        return errs;
    }

    /** {@inheritDoc} */
    @Override public boolean isMutable() {
        return true;
    }

    /** {@inheritDoc} */
    @Override public DiscoveryCustomMessage ackMessage() {
        return new StartRoutineAckDiscoveryMessage(routineId, errs);
    }

    /** {@inheritDoc} */
    @Override public String toString() {
        return S.toString(StartRoutineDiscoveryMessage.class, this, "routineId", routineId());
    }
}
